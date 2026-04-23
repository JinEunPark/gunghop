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

  modules: ['@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'vercel'
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://gunghop.vercel.app',
    name: '냥상가'
  },

  sitemap: {
    exclude: ['/analyzing', '/result']
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#ffd5e0' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '냥상가' },
        { property: 'og:locale', content: 'ko_KR' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/icon-48.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/icon-96.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/icon-512.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ],
      script: headScripts
    }
  }
})
