<script setup lang="ts">
import { usevideoStore } from '@/stores/video.store';
import Hls from 'hls.js';
import { ref, onMounted, computed } from 'vue';
import { usecutVideoStore } from '@/stores/cutVideo.store';
import VideoCutList from '@/components/VideoCutList.vue';
import { useRoute } from "vue-router"

const route = useRoute()

const videoId = route.params.id as string
const videostore = usevideoStore();
const cutVideostore = usecutVideoStore()
const videoRef = ref<HTMLVideoElement | null>(null);

// Sprite sheet
const spriteFrames = ref<string[]>([]);
const startIndex = ref<number | null>(null)
const endIndex = ref<number | null>(null)

const currentTime = ref(0);
const duration = ref(0);
const isPlaying = ref(false);

let hls: Hls | null = null;

// Stream URL computed
const streamUrl = computed(() => {
  if (!videostore.currentvideo) return '';
  return `${import.meta.env.VITE_API_URL}/Videos/stream/${videostore.currentvideo.id}/${videostore.currentvideo.name}/index.m3u8`;
});

// Video başlatma
const initVideo = () => {
  const video = videoRef.value;
  if (!video || !videostore.currentvideo) return;

  // Native HLS desteği varsa direkt ata
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl.value;
    return;
  }

  // Hls.js ile yükle
  if (Hls.isSupported()) {
    if (hls) hls.destroy();
    hls = new Hls();
    hls.loadSource(streamUrl.value);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      // Autoplay engellendiyse sessiz başlatabilirsin
      // video.play().catch(() => {});
    });
  }
};
const fetchSpriteFrames = async () => {
  const columns: number = 10
  const rows: number = 10
  if (!videostore.currentvideo) return;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = `${import.meta.env.VITE_API_URL}/Videos/thumbnail/${videostore.currentvideo.id}/${videostore.currentvideo.name}/sprite.jpg`;
  console.log("Sprite sheet yükleniyor:", img.src);
  img.onload = () => {
    spriteFrames.value = [];

    const spriteWidth = img.width;
    const spriteHeight = img.height;

    // Videonun gerçek çözünürlüğü
    const videoWidth = videostore?.currentvideo?.width ?? spriteWidth;
    const videoHeight = videostore?.currentvideo?.height ?? spriteHeight;

    // Her frame’in boyutu: video çözünürlüğüne göre orantılı
    const frameWidth = Math.floor(videoWidth / columns);
    const frameHeight = Math.floor(videoHeight / rows);

    const canvas = document.createElement("canvas");
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameIndex = 0;
    const frameCount = videostore?.currentvideo?.frameCount || 0; // Toplam frame sayısı
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (frameIndex >= frameCount) break;

        ctx.clearRect(0, 0, frameWidth, frameHeight);

        ctx.drawImage(
          img,
          (col * spriteWidth) / columns,   // source x
          (row * spriteHeight) / rows,     // source y
          spriteWidth / columns,           // source width
          spriteHeight / rows,             // source height
          0, 0,                            // canvas x, y
          frameWidth,                      // canvas width
          frameHeight                      // canvas height
        );

        spriteFrames.value.push(canvas.toDataURL());
        frameIndex++;
      }
    }
  }
};
// Play / Pause toggle
const toggle = () => {
  const video = videoRef.value;
  if (!video) return;

  if (video.paused) {
    video.play();
    isPlaying.value = true;
  } else {
    video.pause();
    isPlaying.value = false;
  }
};

// Zaman güncelle
const updateTime = () => {
  if (!videoRef.value) return;
  currentTime.value = videoRef.value.currentTime;
};

// Toplam süre
const setDuration = () => {
  if (!videoRef.value) return;
  duration.value = videoRef.value.duration;
};

// Formatlı zaman (mm:ss)
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

onMounted(() => {
  if (videoId) {
    cutVideostore.videoId = videoId as string
    cutVideostore.fetchCutVideos()
  }
  if (hls) {
    hls.destroy();
    hls = null;
  }
  if (videostore.currentvideo) {
    initVideo();
    fetchSpriteFrames();
  }
});
function selectFrame(index: number) {
  const video = videoRef.value
  if (!video) return

  // Eğer hiç seçim yoksa → başlangıç seç
  if (startIndex.value === null) {
    startIndex.value = index
    endIndex.value = null
  }
  // Başlangıç var ama bitiş yoksa → bitiş seç
  else if (endIndex.value === null) {
    if (index < startIndex.value) {
      endIndex.value = startIndex.value
      startIndex.value = index
    } else {
      endIndex.value = index
    }
  }
  // İkisi de varsa → reset yap
  else {
    startIndex.value = index
    endIndex.value = null
  }

  // Video seek
  const duration = video.duration || 0
  const totalFrames = spriteFrames.value.length
  if (!totalFrames) return

  const time = (index / totalFrames) * duration
  video.currentTime = time
}
const aspectRatio = computed(() => {
  if (!videostore.currentvideo) return "16 / 9"
  return `${videostore.currentvideo.width} / ${videostore.currentvideo.height}`
})

const isSelectionPlaying = ref(false)

const playSelection = () => {
  const video = videoRef.value
  if (!video || startIndex.value === null || endIndex.value === null) return

  const totalFrames = spriteFrames.value.length
  const duration = video.duration || 0
  const startTime = (startIndex.value / totalFrames) * duration
  const endTime = (endIndex.value / totalFrames) * duration

  video.currentTime = startTime
  video.play()
  isPlaying.value = true
  isSelectionPlaying.value = true

  const handler = () => {
    if (!isSelectionPlaying.value || video.currentTime >= endTime) {
      video.pause()
      isPlaying.value = false
      isSelectionPlaying.value = false
      video.removeEventListener("timeupdate", handler)
    }
  }

  video.addEventListener("timeupdate", handler)
}


const clearSelection = () => {
  startIndex.value = null
  endIndex.value = null

  isSelectionPlaying.value = false
}
const cutVideo = async () => {
  if (!videostore.currentvideo || startIndex.value === null || endIndex.value === null) return

  const totalFrames = spriteFrames.value.length
  const duration = videoRef.value?.duration || 0
  const startSecond = (startIndex.value / totalFrames) * duration
  const endSecond = (endIndex.value / totalFrames) * duration

  try {
    await cutVideostore.cutVideo({
      videoId: videostore.currentvideo.id,
      fileName: "Cut_1",
      startSecond: startSecond,
      endSecond: endSecond
    })
    alert("Video başarıyla kesildi!")
  } catch (err) {
    console.error("Video kesme hatası:", err)
    alert("Video kesilirken bir hata oluştu.")
  }
}

</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Video Düzenleme</h1>
    <div v-if="videostore.currentvideo" class="space-y-4">
      <h2 class="text-lg font-semibold">{{ videostore.currentvideo.name }} {{ videostore.currentvideo.width }}x{{
        videostore.currentvideo.height }}</h2>

      <!-- Video Player -->
      <div class="flex justify-center">
        <div class="relative bg-black rounded-lg overflow-hidden w-full max-w-5xl" :style="{
          aspectRatio: aspectRatio
        }">
          <video ref="videoRef" playsinline class="w-full h-full object-contain" @timeupdate="updateTime"
            @loadedmetadata="setDuration"></video>

          <!-- Overlay Controls -->
          <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/50 p-2 rounded-md">
            <div class="flex gap-2 mb-2">
              <button @click="toggle" class="px-4 py-1.5 rounded-lg bg-black text-white text-sm font-medium
         hover:bg-gray-800 active:scale-95
         transition-all duration-200 shadow-md">
                {{ isPlaying ? '⏸' : '▶' }}
              </button>
              <button @click="playSelection" :disabled="startIndex === null || endIndex === null" class="px-4 py-1.5 rounded-lg  bg-black text-white text-sm font-medium
           hover:bg-green-700 active:scale-95
           disabled:opacity-40 disabled:cursor-not-allowed
           transition-all duration-200 shadow-md">
                ▶ Seçili Kısmı Oynat
              </button>
              <button :disabled="startIndex === null || endIndex === null" @click="clearSelection" class="px-4 py-1.5 rounded-lg bg-gray-700 text-white text-sm
  hover:bg-gray-800 transition-all">
                ✖ Seçimi Temizle
              </button>
              <button @click="cutVideo" class="px-4 py-1.5 rounded-lg bg-gray-700 text-white text-sm
  hover:bg-gray-800 transition-all">
                Seçilen Aralık: {{ startIndex !== null && endIndex !== null ? `${startIndex} - ${endIndex}` : 'Yok' }}
              </button>
            </div>

            <span class="text-white text-sm">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
        <div class="h-2 bg-blue-500 rounded-full transition-all duration-200"
          :style="{ width: duration ? (currentTime / duration) * 100 + '%' : '0%' }"></div>
      </div>
      <div class="relative bg-base-200 p-3 rounded-xl shadow-inner m-2">
        <div class="flex gap-3 m-2 overflow-x-auto flex-nowrap h-20 items-center p-2">
          <div v-for="(frame, index) in spriteFrames" :key="index" @click="selectFrame(index)"
            class="relative cursor-pointer transition-all duration-200 border-2 border-transparent rounded-md overflow-hidden w-20 min-w-[80px] h-12 flex-shrink-0"
            :class="[
              startIndex === index ? 'ring-2 ring-green-500 scale-110 z-10' : '',
              endIndex === index ? 'ring-2 ring-red-500 scale-110 z-10' : '',
              startIndex !== null && endIndex !== null && index > startIndex && index < endIndex ? 'ring-2 ring-blue-400 opacity-80 z-[5]' : ''
            ]">
            <img :src="frame" class="w-20 h-12 object-cover" />
            <div class="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1">
              {{ index }}
            </div>
          </div>
        </div>
      </div>
      <VideoCutList></VideoCutList>
    </div>

    <div v-else class="text-gray-500">Yüklenecek video seçilmedi.</div>
  </div>
 
</template>
