<template>
  <div class="group card bg-base-100 shadow-md hover:shadow-2xl transition-all duration-300 w-72 cursor-pointer">

    <!-- Thumbnail -->
    <figure class="relative overflow-hidden">

      <img
        :src="thumbnailUrl"
        class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <!-- Play icon overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <div class="bg-black/50 rounded-full p-3">
          ▶
        </div>
      </div>

    </figure>

    <!-- Content -->
    <div class="card-body p-4 gap-2">

      <h2 class="card-title text-sm line-clamp-2">
        {{ video.name }}
      </h2>

      <div class="flex justify-between text-xs opacity-70">
        <span>{{ video.width }} x {{ video.height }}</span>
        <span>{{ video.frameCount }} frames</span>
      </div>

      <div class="card-actions justify-end mt-2">
        <button
          class="btn btn-primary btn-xs"
          @click="openVideo"
        >
          Open
        </button>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import type { Video } from "@/types/video.types"

const props = defineProps<{
  video: Video
}>()

const thumbnailUrl =
  `https://localhost:44315/api/Videos/thumbnail/${props.video.id}/${props.video.name}/thumbnail.jpg`

const openVideo = () => {
  console.log("Video opened:", props.video.id)
}
</script>
