/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config
const adsenseClient = process.env.NUXT_PUBLIC_ADSENSE_CLIENT

type HeadScript = {
  src: string
  defer?: boolean
  async?: boolean
  crossorigin?: '' | 'anonymous' | 'use-credentials'
}

const headScripts: HeadScript[] = [
  {
    src: 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js',
    defer: true
  }
]

if (adsenseClient) {
  headScripts.push({
    src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`,
    async: true,
    crossorigin: 'anonymous'
  })
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'vercel'
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    public: {
      adsenseClient,
      gaId: process.env.NUXT_PUBLIC_GA_ID,
      kakaoAppKey: process.env.NUXT_PUBLIC_KAKAO_APP_KEY,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: '결혼 관상 AI 궁합',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/webp', href: '/assets/main_logo_char.webp' },
        { rel: 'apple-touch-icon', href: '/assets/main_logo_char.webp' }
      ],
      script: headScripts
    }
  }
})
