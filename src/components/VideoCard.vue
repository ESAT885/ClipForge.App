<template>
  <div class="group card bg-base-100 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer">

    <!-- Thumbnail -->
    <figure class="relative overflow-hidden">
      <div class="relative w-full h-40">
          <img
            v-if="video.status=='Complete'"
        :src="thumbnailUrl"
        class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      </div>


      <!-- Play icon overlay -->
      <div @click.stop="openDialogVideo" class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <div class="bg-black/50 rounded-full p-3 text-white text-xl">
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
          @click.stop="openVideo"
        >
          Aç
        </button>
      </div>

    </div>

    <!-- Video Dialog -->
    <VideoDialog
      ref="videoDialog"
      :src="videoSrc"
      :title="video.name"
    />
  </div>
</template>

<script setup lang="ts">
import type { Video } from "@/types/video.types"
import { useRouter } from "vue-router"
import { ref } from "vue"
import VideoDialog from "./VideoDialog.vue"
import { usevideoStore } from '@/stores/video.store';
const props = defineProps<{ video: Video }>()
const videostore = usevideoStore();
const router = useRouter()
const videoDialog = ref<InstanceType<typeof VideoDialog> | null>(null)

// Thumbnail URL
const thumbnailUrl = `${import.meta.env.VITE_API_URL}/Videos/thumbnail/${props.video.id}/${props.video.name}/thumbnail.jpg`

// Video URL (Dialog için)
const videoSrc = `${import.meta.env.VITE_API_URL}/Videos/stream/${props.video.id}/${props.video.name}/index.m3u8`

// Router ile detay sayfasına git
function openVideo() {
videostore.setCurrentVideo(props.video) // Store'a seçilen videoyu kaydet
  router.push(`/videodetail/${props.video.id}`)
}

// Dialog aç
function openDialogVideo() {
  if (videoDialog.value) {
    videoDialog.value.open()
  }
}
</script>
