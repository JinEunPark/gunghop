const FALLBACK_SITE_URL = 'https://gunghop.vercel.app'

function resolveSiteUrl(envUrl: string): string {
  if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
    return FALLBACK_SITE_URL
  }
  return envUrl.replace(/\/$/, '')
}

export function usePageSeo(opts: {
  title: string
  description: string
  ogImagePath?: string
  noindex?: boolean
}) {
  const config = useRuntimeConfig()
  const route = useRoute()

  const siteUrl = resolveSiteUrl((config.public.siteUrl as string) || '')
  const pageUrl = `${siteUrl}${route.path}`
  const ogImage = `${siteUrl}${opts.ogImagePath ?? '/og-image.png'}`

  useSeoMeta({
    title: opts.title,
    description: opts.description,
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    ogImageAlt: opts.title,
    ogUrl: pageUrl,
    twitterTitle: opts.title,
    twitterDescription: opts.description,
    twitterImage: ogImage,
    twitterImageAlt: opts.title,
    robots: opts.noindex ? 'noindex, nofollow' : 'index, follow'
  })

  useHead({
    link: [{ rel: 'canonical', href: pageUrl }]
  })
}
