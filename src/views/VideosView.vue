<script setup lang="ts">
import {  onMounted } from "vue"
import { usevideoStore } from '@/stores/video.store';
import VideoCard from '@/components/VideoCard.vue';
import { useRouter } from "vue-router";
const router = useRouter()
const videostore = usevideoStore();
onMounted(() => {
  videostore.fetchVideos()
})
function addNewVideo() {
  router.push(`/videodetail`)
}
</script>
<template>
  <div class="p-4 sm:p-6 space-y-6">

    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold">Videolar</h1>

      <button
        class="btn btn-primary w-full sm:w-auto"
        @click="addNewVideo"
      >
        + Yeni Video
      </button>
    </div>

    <!-- Video Grid -->
    <div
      v-if="videostore.videos.length"
      class="grid gap-4 sm:gap-6
             grid-cols-1
             xs:grid-cols-2
             md:grid-cols-3
             lg:grid-cols-4
             xl:grid-cols-5"
    >
      <VideoCard
        v-for="v in videostore.videos"
        :key="v.id"
        :video="v"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-12 sm:py-20 opacity-60 text-center px-4"
    >
      <p class="text-sm sm:text-base">Henüz video yok</p>

      <button
        class="btn btn-primary mt-4 w-full sm:w-auto"
        @click="null"
      >
        İlk Videoyu Yükle
      </button>
    </div>

  </div>
</template>
