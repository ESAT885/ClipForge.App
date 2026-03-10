<script setup lang="ts">
import { usevideoStore } from '@/stores/video.store';
import {  useRouter } from "vue-router"


const router = useRouter()
const goBack = () => {
  router.back()
}
const videostore = usevideoStore();
</script>
<template>
    <div class="sticky top-0 z-20 bg-base-100 border-b border-base-300 shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">

      <!-- Back button -->
      <button @click="goBack" class="btn btn-ghost btn-sm flex items-center gap-2 text-3xl font-bold">
        ←
      </button>

      <!-- Title -->
      <div class="flex flex-col">
        <h1 class="text-lg font-bold">
          Video Editör
        </h1>

        <span v-if="videostore.currentvideo" class="text-sm opacity-70">
          {{ videostore.currentvideo.name }}
          •
          {{ videostore.currentvideo.width }}x{{ videostore.currentvideo.height }}
        </span>
      </div>

    </div>
  </div>
</template>
