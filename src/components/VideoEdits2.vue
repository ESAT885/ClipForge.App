<script setup lang="ts">
import { ref, onMounted } from "vue"
import axios from "axios"

const props = defineProps<{
  videoId: string
  videoUrl: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

const duration = ref(0)
const start = ref(0)
const end = ref(5)

const loading = ref(false)
const cutResultUrl = ref<string | null>(null)

onMounted(() => {
  if (!videoRef.value) return

  videoRef.value.onloadedmetadata = () => {
    duration.value = videoRef.value!.duration
    end.value = Math.min(5, duration.value)
  }
})

const cutVideo = async () => {
  if (start.value >= end.value) {
    alert("Başlangıç bitişten küçük olmalı")
    return
  }

  loading.value = true

  try {
    const res = await axios.post("/api/videos/cut", {
      videoId: props.videoId,
      startSecond: start.value,
      endSecond: end.value
    })

    cutResultUrl.value = res.data.path
  } catch (err) {
    console.error(err)
    alert("Kesme işlemi başarısız")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4 space-y-4">

    <!-- 🎬 Video Preview -->
    <video
      ref="videoRef"
      :src="videoUrl"
      controls
      class="w-full rounded-lg"
    />

    <!-- 🎚 Slider Alanı -->
    <div>
      <label>Başlangıç: {{ start.toFixed(2) }} sn</label>
      <input
        type="range"
        min="0"
        :max="duration"
        step="0.1"
        v-model="start"
        class="w-full"
      />

      <label>Bitiş: {{ end.toFixed(2) }} sn</label>
      <input
        type="range"
        min="0"
        :max="duration"
        step="0.1"
        v-model="end"
        class="w-full"
      />
    </div>

    <!-- ✂ Buton -->
    <button
      @click="cutVideo"
      :disabled="loading"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      {{ loading ? "Kesiliyor..." : "Videoyu Kes" }}
    </button>

    <!-- 🎥 Sonuç -->
    <div v-if="cutResultUrl">
      <h3 class="font-bold">Kesilen Video:</h3>
      <video
        :src="cutResultUrl"
        controls
        class="w-full rounded-lg"
      />
    </div>

  </div>
</template>
