<script setup lang="ts">
withDefaults(defineProps<{ id?: string }>(), { id: 'gc' })
</script>

<template>
  <svg viewBox="0 0 100 100" class="face" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient :id="`${id}-bg`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FCE7F3" />
        <stop offset="1" stop-color="#F9A8D4" />
      </linearGradient>
      <radialGradient :id="`${id}-cheek`" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#EC4899" stop-opacity="0.55" />
        <stop offset="1" stop-color="#EC4899" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="100" height="100" :fill="`url(#${id}-bg)`" />
    <path d="M28 52 Q28 28 50 28 Q72 28 72 52 Q72 76 50 76 Q28 76 28 52 Z" fill="#FFFFFF" stroke="#9D174D" stroke-width="1.5" />
    <path d="M31 40 Q27 22 38 26 Q43 30 45 38 Z" fill="#FFFFFF" stroke="#9D174D" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M69 40 Q73 22 62 26 Q57 30 55 38 Z" fill="#FFFFFF" stroke="#9D174D" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M33 37 Q32 28 38 29 Q40 33 41 38 Z" fill="#FBCFE8" />
    <path d="M67 37 Q68 28 62 29 Q60 33 59 38 Z" fill="#FBCFE8" />
    <path d="M66 26 Q62 22 60 26 Q62 28 66 28 Q70 28 72 26 Q70 22 66 26 Z" fill="#EC4899" stroke="#9D174D" stroke-width="0.8" stroke-linejoin="round" />
    <circle cx="66" cy="27" r="1.2" fill="#BE185D" />
    <ellipse cx="38" cy="58" rx="7" ry="4.5" :fill="`url(#${id}-cheek)`" />
    <ellipse cx="62" cy="58" rx="7" ry="4.5" :fill="`url(#${id}-cheek)`" />
    <ellipse cx="42" cy="51" rx="2.8" ry="3.4" fill="#1F2937" />
    <ellipse cx="58" cy="51" rx="2.8" ry="3.4" fill="#1F2937" />
    <circle cx="43" cy="50" r="1.1" fill="#fff" />
    <circle cx="59" cy="50" r="1.1" fill="#fff" />
    <path d="M39 48 L37 46" stroke="#1F2937" stroke-width="0.8" stroke-linecap="round" />
    <path d="M61 48 L63 46" stroke="#1F2937" stroke-width="0.8" stroke-linecap="round" />
    <path d="M48.5 59 Q50 57 51.5 59 Q50 61 50 61 Z" fill="#EC4899" stroke="#BE185D" stroke-width="0.5" />
    <path d="M50 61 Q50 63 47.5 63 M50 61 Q50 63 52.5 63" stroke="#9D174D" stroke-width="1" stroke-linecap="round" fill="none" />
    <g stroke="#BE185D" stroke-width="0.7" stroke-linecap="round" opacity="0.7">
      <path d="M30 60 L42 61" />
      <path d="M30 64 L42 64" />
      <path d="M70 60 L58 61" />
      <path d="M70 64 L58 64" />
    </g>
    <path d="M76 40 Q74 38 73 40 Q73 42 76 44 Q79 42 79 40 Q78 38 76 40 Z" fill="#EC4899" />
  </svg>
</template>
