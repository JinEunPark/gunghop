import { captureCardBlob } from "./useCardCapture";

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        uploadImage: (opts: { file: File[] }) => Promise<{
          infos: { original: { url: string; width: number; height: number } };
        }>;
        sendDefault: (opts: Record<string, unknown>) => void;
        sendScrap: (opts: { requestUrl: string; templateId?: number }) => void;
      };
    };
  }
}

export type KakaoShareError =
  | "SDK_NOT_LOADED"
  | "APP_KEY_MISSING"
  | "SHARE_MODULE_MISSING"
  | "BLOB_FAILED"
  | "UPLOAD_FAILED"
  | "FALLBACK"
  | "SHARE_FAILED";

export function useKakaoShare() {
  const config = useRuntimeConfig();
  const sharing = ref(false);
  const error = ref<KakaoShareError | null>(null);

  function getKakao() {
    if (typeof window === "undefined") throw new Error("SSR");
    const K = window.Kakao;
    if (!K || typeof K.init !== "function") throw new Error("SDK_NOT_LOADED");
    if (!K.isInitialized()) {
      const key = config.public.kakaoAppKey as string;
      if (!key) throw new Error("APP_KEY_MISSING");
      K.init(key);
    }
    if (!K.Share) throw new Error("SHARE_MODULE_MISSING");
    return K;
  }

  async function waitForSdk(timeoutMs = 6000): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (
        typeof window !== "undefined" &&
        typeof window.Kakao?.init === "function"
      )
        return;
      await new Promise((r) => setTimeout(r, 100));
    }
    throw new Error("SDK_NOT_LOADED");
  }

  function siteUrl(): string {
    const envUrl = (config.public.siteUrl as string) || "";
    if (
      !envUrl ||
      envUrl.includes("localhost") ||
      envUrl.includes("127.0.0.1")
    ) {
      console.warn("url:" + window.location.origin);
      return window.location.origin;
    }
    console.warn("url:" + envUrl);

    return envUrl;
  }

  function shareScrap() {
    try {
      const K = getKakao();
      K.Share.sendScrap({ requestUrl: siteUrl() });
    } catch (e) {
      error.value = "SHARE_FAILED";
      throw e;
    }
  }

  async function shareCardImage(opts: {
    cardEl: HTMLElement;
    score: number;
    summary: string;
  }) {
    sharing.value = true;
    error.value = null;

    try {
      const [, blob] = await Promise.all([
        waitForSdk(),
        captureCardBlob(opts.cardEl),
      ]);
      const K = getKakao();

      const file = new File([blob], "nyangsang-result.png", {
        type: "image/png",
      });
      const up = await K.Share.uploadImage({ file: [file] });
      const imageUrl = up?.infos?.original?.url;
      if (!imageUrl) throw new Error("UPLOAD_FAILED");

      const url = siteUrl();
      K.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${opts.score}점 결혼 궁합 결과 💕`,
          description: opts.summary,
          imageUrl,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          {
            title: "나도 궁합 보기",
            link: { mobileWebUrl: url, webUrl: url },
          },
        ],
      });
    } catch (e: unknown) {
      console.error("[kakao] share failed, falling back to scrap", e);
      try {
        shareScrap();
        error.value = "FALLBACK";
      } catch {
        const msg = e instanceof Error ? e.message : "SHARE_FAILED";
        error.value = (msg as KakaoShareError) || "SHARE_FAILED";
        throw e;
      }
    } finally {
      sharing.value = false;
    }
  }

  return { sharing, error, shareCardImage, shareScrap, siteUrl };
}
