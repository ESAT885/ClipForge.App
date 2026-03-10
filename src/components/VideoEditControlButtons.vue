<script setup lang="ts">

defineProps<{
  isPlaying: boolean
  startIndex: number | null
  endIndex: number | null
}>()

const emit = defineEmits([
  "toggle",
  "playSelection",
  "clearSelection",
  "cutVideo"
])

</script>

<template>

<div class="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/50 p-2 rounded-md">

  <div class="flex gap-2">

    <button
      @click="emit('toggle')"
      class=" btn px-4 py-1.5 rounded-lg bg-black text-white text-sm"
    >
      {{ isPlaying ? '⏸' : '▶' }}
    </button>

    <button
      @click="emit('playSelection')"
      :disabled="startIndex === null || endIndex === null"
      class="btn px-4 py-1.5 rounded-lg bg-black text-white text-sm"
    >
      ▶ Seçili Oynat
    </button>

    <button
      @click="emit('clearSelection')"
      :disabled="startIndex === null || endIndex === null"
      class="btn px-4 py-1.5 rounded-lg bg-gray-700 text-white text-sm"
    >
      ✖ Temizle
    </button>

    <button
      @click="emit('cutVideo')"
      :disabled="startIndex === null || endIndex === null"
      class="btn px-4 py-1.5 rounded-lg bg-gray-700 text-white text-sm"
    >
      ✂ Kes
    </button>

  </div>

  <slot name="time"></slot>

</div>

</template>
