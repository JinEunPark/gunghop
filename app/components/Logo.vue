<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 26 })
</script>

<template>
  <div class="logo">
    <img src="/assets/main_logo_char.webp" alt="냥상가" :width="size" :height="size" />
    <span>냥상가<span class="heart">♥</span></span>
  </div>
</template>

<style scoped>
.logo {
  font-weight: 800;
  font-size: 19px;
  letter-spacing: -0.02em;
  color: var(--brand-600);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.logo img {
  object-fit: contain;
}
.heart {
  color: var(--brand-500);
  font-size: 14px;
  transform: translateY(-3px);
  display: inline-block;
  margin-left: 1px;
}
</style>
