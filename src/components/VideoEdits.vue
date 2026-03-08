<script setup lang="ts">
import { ref } from "vue";
import Hls from "hls.js";
import { usevideoStore } from "@/stores/video.store";

const videostore = usevideoStore();

// Video player
const videoRef = ref<HTMLVideoElement | null>(null);
const selectedFrame = ref<string | undefined>(undefined);
let hls: Hls | null = null;

// Sprite sheet
const spriteFrames = ref<string[]>([]);
const startIndex = ref<number | null>(null)
const endIndex = ref<number | null>(null)

function sliceSpriteFromVideoFrameCount(frameCount: number, columns: number, rows: number) {
  if (!videostore.lastvideo) return;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = `${import.meta.env.VITE_API_URL}/Videos/thumbnail/${videostore.lastvideo.id}/${videostore.lastvideo.name}/sprite.jpg`;

  img.onload = () => {
    spriteFrames.value = [];

    const spriteWidth = img.width;
    const spriteHeight = img.height;

    // Videonun gerçek çözünürlüğü
    const videoWidth = videostore?.lastvideo?.width ?? spriteWidth;
    const videoHeight = videostore?.lastvideo?.height ?? spriteHeight;

    // Her frame’in boyutu: video çözünürlüğüne göre orantılı
    const frameWidth = Math.floor(videoWidth / columns);
    const frameHeight = Math.floor(videoHeight / rows);

    const canvas = document.createElement("canvas");
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameIndex = 0;

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
  };
}

// Video HLS init
function initVideo() {
  const video = videoRef.value;
  if (!video || !videostore.lastvideo) return;

  const streamUrl = `${import.meta.env.VITE_API_URL}/Videos/stream/${videostore.lastvideo.id}/${videostore.lastvideo.name}/index.m3u8`;

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = streamUrl;
   // video.play().catch(() => console.warn("Autoplay engellendi"));
    return;
  }

  if (Hls.isSupported()) {
    if (hls) hls.destroy();
    hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {/*video.play()*/});
  }
  // toggle();
}

// Click sprite → video seek
function seekVideo(frameIndex: number) {
  const video = videoRef.value;
  if (!video) return;
  const duration = video.duration || 0;
  const totalFrames = spriteFrames.value.length;
  if (!totalFrames) return;

  const time = (frameIndex / totalFrames) * duration;
  video.currentTime = time;
  //video.play().catch(() => console.warn("Autoplay engellendi"));
  selectedFrame.value = spriteFrames.value[frameIndex];



}
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
const isPlaying = ref(false)
const toggle = () => {
  if (!videoRef.value) return

  if (videoRef.value.paused) {
    videoRef.value.play()
    isPlaying.value = true
  } else {
    videoRef.value.pause()
    isPlaying.value = false
  }
}
const currentTime = ref(0)
const duration = ref(0)

const updateTime = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
}

const setDuration = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}
function formatTime(seconds: number) {
  if (!seconds) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}
</script>

<template>
  <button class="btn btn-soft btn-primary" @click="initVideo">Video Görüntüle</button>
  <button class="btn btn-soft btn-primary"
    @click="  sliceSpriteFromVideoFrameCount(videostore?.lastvideo?.frameCount ?? 0, 10, 10);">Frame Görüntüle</button>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Video player -->
    <div class="flex-1 ">
      <video ref="videoRef" controls  playsinline
      class="w-full rounded-lg bg-black"
      @timeupdate="updateTime"
      @loadedmetadata="setDuration"
      ></video>
    </div>

    <button @click="toggle">
      {{ isPlaying ? "Pause" : "Play" }}
    </button>
    <!-- Sprite / Timeline grid -->

  </div>
<div class="mt-2 text-sm">
  {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
</div>
 <div class="flex-1 mt-6">
  <h2 class="text-lg font-semibold mb-3">Timeline</h2>

  <div class="relative bg-base-200 p-3 rounded-xl shadow-inner m-2">
    <div class="flex gap-1 m-2">
      <div
        v-for="(frame, index) in spriteFrames"
        :key="index"
        @click="selectFrame(index)"
        class="relative cursor-pointer transition-all duration-200  "
        :class="[
          'border rounded-md overflow-hidden',
          startIndex === index ? 'border-green-500 scale-110' : '',
          endIndex === index ? 'border-red-500 scale-110' : '',
          startIndex !== null && endIndex !== null && index > startIndex && index < endIndex
            ? 'border-blue-400 opacity-80'
            : ''
        ]"
      >
        <img
          :src="frame"
          class="w-20  h-12 object-cover"
        />

        <!-- Index badge -->
        <div class="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1">
          {{ index }}
        </div>
      </div>
    </div>
  </div>

  <!-- Seçim bilgisi -->
  <div class="mt-3 text-sm">
    <span v-if="startIndex !== null">
      Start: <b>{{ startIndex }}</b>
    </span>

    <span v-if="endIndex !== null" class="ml-4">
      End: <b>{{ endIndex }}</b>
    </span>
  </div>

</div>
</template>

<style scoped>
/* opsiyonel stil */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

video::-webkit-media-controls {
  display: none !important;
}
</style>
