<script setup lang="ts">
import { usevideoStore } from "@/stores/video.store";
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import Hls from 'hls.js';
import VideoEdits from "@/components/VideoEdits.vue";

// HomeView.vue


const videostore = usevideoStore();

const videoRef = ref<HTMLVideoElement | null>(null);
const error = ref('');
let hls: Hls | null = null;

// Upload handler
function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  if (!file) return;
  videostore.uploadVideo(file);
}

// Video initialization
function initVideo() {
  error.value = '';
  const video = videoRef.value;
  const lastVideo = videostore.lastvideo;

  if (!lastVideo?.id) {
    error.value = 'Henüz video yok';
    return;
  }
  if (!video) return;

  const streamUrl = `${import.meta.env.VITE_API_URL}/Videos/stream/${lastVideo.id}/${lastVideo.name}/index.m3u8`;

  // Safari fallback
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl;
    video.play().catch(() => {
      console.warn('Autoplay engellendi.');
    });
    return;
  }

  // HLS.js fallback
  if (Hls.isSupported()) {
    if (hls) hls.destroy(); // Cleanup eski instance
    hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => console.warn('Autoplay engellendi.'));
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      console.error(data);
      error.value = 'Video yüklenemedi';
    });
  } else {
    error.value = 'Tarayıcı HLS desteklemiyor';
  }
}

// Auto init video if lastvideo changes
watch(() => videostore.lastvideo, (newVal) => {
  if (newVal) {
    //initVideo();
  }
}, { immediate: false });

// Fetch files on mount
onMounted(() => {
  document.title = "Home - ClipForge";
  //videostore.fetchVideos();
});

// Cleanup HLS
onBeforeUnmount(() => {
  if (hls) {
    hls.destroy();
    hls = null;
  }
});
// const videoThumbnailUrl = computed(() => {
//   if (!videostore.lastvideo) return "/fallback-thumbnail.jpg";
//   return `${import.meta.env.VITE_API_URL}/Videos/thumbnail/${videostore.lastvideo.id}/${videostore.lastvideo.name}/thumbnail.jpg`;
// });
// const sipretThumbnailUrl = computed(() => {
//   if (!videostore.lastvideo) return "/fallback-thumbnail.jpg";
//   return `${import.meta.env.VITE_API_URL}/Videos/thumbnail/${videostore.lastvideo.id}/${videostore.lastvideo.name}/sprite.jpg`;
// });
</script>

<template>
  <main class="p-8 space-y-6">
    <h2 class="text-3xl font-bold">Welcome to ClipForge</h2>

    <!-- Upload -->
    <div>
      <h1 class="text-2xl font-semibold mb-2">Dosya Yükle</h1>
      <label class="btn btn-primary">
        Dosya Seç
        <input type="file" hidden accept="video/*" @change="handleUpload" />
      </label>

      <div v-if="videostore.process" class="mt-2 space-y-1">
        <progress class="progress progress-primary w-full" :value="videostore.progress" ></progress>
        <p class="text-sm">{{ videostore.progress }}%</p>
      </div>
    </div>
    <!-- <button class="btn btn-soft btn-primary" @click="initVideo">Video Görüntüle</button> -->
    <!-- Video Player -->
    <!-- <div class="card bg-base-100 shadow-xl mt-6">
      <div class="card-body p-0">
        <video ref="videoRef" controls autoplay playsinline class="w-full rounded-t-xl bg-black"></video>
      </div>
    </div> -->

    <!-- Error -->
    <div v-if="error" class="alert alert-error mt-4">
      {{ error }}
    </div>
    <!-- <div class="card-body">
      <figure>
        <img :src="videoThumbnailUrl" />
      </figure>
    </div>
     <div class="card-body">
      <figure>
        <img :src="sipretThumbnailUrl" />
      </figure>
    </div> -->
    <VideoEdits></VideoEdits>

  </main>
</template>
