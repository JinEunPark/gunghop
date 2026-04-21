<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  showBack?: boolean
  translucent?: boolean
}>(), {
  title: '',
  showBack: false,
  translucent: false
})

const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <div class="app-header" :style="{ background: translucent ? 'transparent' : '#fff' }">
    <button v-if="showBack" class="back" @click="emit('back')">←</button>
    <div v-else class="spacer" />
    <div class="title">{{ title }}</div>
    <div class="spacer" />
  </div>
</template>

<style scoped>
.title {
  font-weight: 700;
  font-size: 14px;
  color: var(--gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: center;
}
.spacer {
  width: 36px;
  flex-shrink: 0;
}
</style>
