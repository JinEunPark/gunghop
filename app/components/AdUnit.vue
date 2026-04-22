<script setup lang="ts">
declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const props = withDefaults(
  defineProps<{
    slot: string
    format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid'
    layoutKey?: string
    responsive?: boolean
    label?: string
  }>(),
  {
    format: 'auto',
    responsive: true,
    label: '광고'
  }
)

const config = useRuntimeConfig()
const route = useRoute()

const adsenseClient = computed(() => (config.public.adsenseClient as string) || '')
const noAds = computed(() => route.query.noads === '1')
const hasRealAd = computed(
  () => !noAds.value && !!adsenseClient.value && !!props.slot
)

onMounted(() => {
  if (!hasRealAd.value) return
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (e) {
    console.warn('[adsense] push failed', e)
  }
})
</script>

<template>
  <ins
    v-if="hasRealAd"
    class="adsbygoogle ad-unit"
    :data-ad-client="adsenseClient"
    :data-ad-slot="slot"
    :data-ad-format="format"
    :data-ad-layout-key="layoutKey"
    :data-full-width-responsive="responsive ? 'true' : 'false'"
  />
  <div v-else-if="!noAds" class="adph">
    <div class="tag">{{ label }}</div>Google AdSense
  </div>
</template>

<style scoped>
.ad-unit {
  display: block;
  min-height: 90px;
}
</style>
