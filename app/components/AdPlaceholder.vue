<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: '광고' })
</script>

<template>
  <div class="adph">
    <div class="tag">{{ label }}</div>Google AdSense
  </div>
</template>
