<script setup lang="ts">
withDefaults(defineProps<{
  step: number
  total?: number
  label?: string
}>(), {
  total: 3,
  label: ''
})
</script>

<template>
  <div class="prog">
    <div
      v-for="i in total"
      :key="i"
      class="seg"
      :class="{ on: i <= step }"
    />
    <div class="label">{{ step }}/{{ total }} {{ label }}</div>
  </div>
</template>
