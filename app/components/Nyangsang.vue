<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

type Pose = 'default' | 'thinking' | 'happy'

const props = withDefaults(defineProps<{ pose?: Pose; size?: number }>(), {
  pose: 'default',
  size: 96
})

const height = computed(() => Math.round(props.size * (475 / 357)))

const poseStyle = computed<CSSProperties>(() => {
  if (props.pose === 'thinking') return { animation: 'nyWiggle 1.6s ease-in-out infinite' }
  if (props.pose === 'happy') return { animation: 'nyBob 2.2s ease-in-out infinite' }
  return {}
})
</script>

<template>
  <img
    src="/assets/nyangsang-char.png"
    alt="냥선생"
    :width="size"
    :height="height"
    :style="poseStyle"
    class="nyangsang-img"
    draggable="false"
  >
</template>

<style scoped>
.nyangsang-img {
  display: block;
  object-fit: contain;
  user-select: none;
}
</style>
