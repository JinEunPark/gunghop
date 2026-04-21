<script setup lang="ts">
const checked = defineModel<boolean>({ required: true })
</script>

<template>
  <div class="consent" :class="{ checked }" @click="checked = !checked">
    <div class="cb">✓</div>
    <div>
      <slot />
    </div>
  </div>
</template>
