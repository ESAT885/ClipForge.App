<script setup lang="ts">
import {  onMounted } from "vue"
import { usevideoStore } from '@/stores/video.store';
import VideoCard from '@/components/VideoCard.vue';

const videostore = usevideoStore();
onMounted(() => {
  videostore.fetchVideos()
})
</script>
<template>

  <div class="p-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">

      <h1 class="text-2xl font-bold">
        Videos
      </h1>

      <button
        class="btn btn-primary"
        @click="null"
      >
        + New Video
      </button>

    </div>


    <!-- Video Grid -->
    <div
      v-if="videostore.videos.length"
      class="
        grid
        gap-6
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
      "
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
      class="flex flex-col items-center justify-center py-20 opacity-60"
    >
      <p>No videos yet</p>

      <button
        class="btn btn-primary mt-4"
        @click="null"
      >
        Upload First Video
      </button>
    </div>

  </div>
</template>
