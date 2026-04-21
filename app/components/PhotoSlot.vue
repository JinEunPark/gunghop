<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ label: string }>()

const value = defineModel<string | null>({ required: true })
const inputRef = ref<HTMLInputElement | null>(null)

function onPick(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    value.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

function clear(e: Event) {
  e.stopPropagation()
  value.value = null
  if (inputRef.value) inputRef.value.value = ''
}

function pickFile() {
  if (!value.value) inputRef.value?.click()
}
</script>

<template>
  <div>
    <div class="uploader" :class="{ filled: !!value }" @click="pickFile">
      <template v-if="value">
        <img :src="value" :alt="label">
        <button class="x" @click="clear">✕</button>
      </template>
      <template v-else>
        <span class="icon">📷</span>
        <span class="label">{{ label }}</span>
        <span class="sub">눌러서 업로드</span>
      </template>
      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        style="display:none"
        @change="onPick"
      >
    </div>
    <div class="label-filled">{{ label }}</div>
  </div>
</template>
