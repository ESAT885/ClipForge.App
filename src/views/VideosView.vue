<script setup lang="ts">
import { onMounted, ref } from "vue"
import { usevideoStore } from '@/stores/video.store';
import VideoCard from '@/components/VideoCard.vue';

import VideoAddDialog from '@/components/VideoAddDialog.vue';
const videoAddDialog = ref<InstanceType<typeof VideoAddDialog> | null>(null)


const videostore = usevideoStore();
onMounted(() => {
  videostore.fetchVideos()
})

function openAddDialogVideo() {
  if (videoAddDialog.value) {
    videoAddDialog.value.open()
  }
}
</script>
<template>
  <div class="p-4 sm:p-6 space-y-6">

    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <!-- Title -->
      <div class="flex items-center gap-3">

        <div class="p-1 rounded-lg ">
          <img src="../../public/logo.png" alt="ClipForge" class="w-10 h-10 object-contain" />
        </div>


        <div>
          <h1 class="text-2xl font-bold leading-none">Videolar</h1>
          <p class="text-sm text-base-content/60">
            Yüklediğin videoları kes ve düzenle
          </p>
        </div>

      </div>

      <!-- Button -->
      <button class="btn btn-primary shadow-lg rounded-full p-4" @click="openAddDialogVideo">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>

        Yeni Video
      </button>

    </div>
    <div class="flex gap-2 mb-4">
      <input type="text" placeholder="Video ara..." class="input input-bordered w-full " />
      <select class="select select-bordered">
        <option>Tümü</option>
        <option>Tamamlandı</option>
        <option>İşleniyor</option>
      </select>
    </div>
    <!-- Video Grid -->
    <div v-if="videostore.videos.length" class="grid gap-4 sm:gap-6
             grid-cols-1
             xs:grid-cols-2
             md:grid-cols-3
             lg:grid-cols-4
             xl:grid-cols-5">
      <VideoCard v-for="v in videostore.videos" :key="v.id" :video="v" />
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 sm:py-20 opacity-60 text-center px-4">
      <p class="text-sm sm:text-base">Henüz video yok</p>

      <button class="btn btn-primary mt-4 w-full sm:w-auto" @click="null">
        İlk Videoyu Yükle
      </button>
    </div>

  </div>
  <VideoAddDialog ref="videoAddDialog" />
</template>
