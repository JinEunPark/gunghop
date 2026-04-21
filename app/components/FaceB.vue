<script setup lang="ts">
withDefaults(defineProps<{ id?: string }>(), { id: 'bc' })
</script>

<template>
  <svg viewBox="0 0 100 100" class="face" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient :id="`${id}-bg`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#DBEAFE" />
        <stop offset="1" stop-color="#93C5FD" />
      </linearGradient>
      <radialGradient :id="`${id}-cheek`" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#F472B6" stop-opacity="0.5" />
        <stop offset="1" stop-color="#F472B6" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="100" height="100" :fill="`url(#${id}-bg)`" />
    <path d="M28 52 Q28 28 50 28 Q72 28 72 52 Q72 76 50 76 Q28 76 28 52 Z" fill="#F9FAFB" stroke="#475569" stroke-width="1.5" />
    <path d="M31 40 Q27 22 38 26 Q43 30 45 38 Z" fill="#F9FAFB" stroke="#475569" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M69 40 Q73 22 62 26 Q57 30 55 38 Z" fill="#F9FAFB" stroke="#475569" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M33 37 Q32 28 38 29 Q40 33 41 38 Z" fill="#BFDBFE" />
    <path d="M67 37 Q68 28 62 29 Q60 33 59 38 Z" fill="#BFDBFE" />
    <path d="M42 78 L36 74 L38 82 Z" fill="#2563EB" />
    <path d="M58 78 L64 74 L62 82 Z" fill="#2563EB" />
    <circle cx="50" cy="78" r="2.2" fill="#1D4ED8" />
    <ellipse cx="38" cy="58" rx="6" ry="4" :fill="`url(#${id}-cheek)`" />
    <ellipse cx="62" cy="58" rx="6" ry="4" :fill="`url(#${id}-cheek)`" />
    <ellipse cx="42" cy="51" rx="2.6" ry="3.2" fill="#1F2937" />
    <ellipse cx="58" cy="51" rx="2.6" ry="3.2" fill="#1F2937" />
    <circle cx="43" cy="50" r="0.9" fill="#fff" />
    <circle cx="59" cy="50" r="0.9" fill="#fff" />
    <path d="M48.5 59 Q50 57 51.5 59 Q50 61 50 61 Z" fill="#F472B6" stroke="#BE185D" stroke-width="0.5" />
    <path d="M50 61 Q50 63 47.5 63 M50 61 Q50 63 52.5 63" stroke="#475569" stroke-width="1" stroke-linecap="round" fill="none" />
    <g stroke="#64748B" stroke-width="0.7" stroke-linecap="round" opacity="0.8">
      <path d="M30 60 L42 61" />
      <path d="M30 64 L42 64" />
      <path d="M70 60 L58 61" />
      <path d="M70 64 L58 64" />
    </g>
  </svg>
</template>
