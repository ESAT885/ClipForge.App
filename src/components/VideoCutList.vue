<script setup lang="ts">
import { usecutVideoStore } from '@/stores/cutVideo.store'
import type { CutVideo } from '@/types/cutVideo.types'



const cutVideostore = usecutVideoStore()



function duration(cut: CutVideo) {
  return cut.endSecond - cut.startSecond
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function progressWidth(cut: CutVideo) {
  const total = cut.endSecond + cut.startSecond
  return ((cut.endSecond - cut.startSecond) / total * 100).toFixed(1) + '%'
}
function progressLeft(cut: CutVideo) {
  const total = cut.endSecond + cut.startSecond
  return (cut.startSecond / total * 100).toFixed(1) + '%'
}
</script>

<template>
  <div class="space-y-2">
    <!-- Section Header -->
    <div class="flex items-center justify-between px-1">
      <h3 class="text-base font-semibold">Kesimler</h3>
      <span class="badge badge-ghost badge-sm">{{ cutVideostore.cutVideos?.length }} adet</span>
    </div>

    <!-- Empty -->
    <div v-if="cutVideostore.cutVideos.length === 0"
      class="bg-base-200 rounded-xl p-8 text-center text-base-content/40 text-sm">
      Henüz kesim yok
    </div>

    <!-- List -->
    <div v-else class="bg-base-200 rounded-xl overflow-hidden shadow-inner">
      <div v-for="(cut, i) in cutVideostore.cutVideos" :key="cut.id ?? cut.videoId"
        class="flex items-center gap-3 px-4 py-3 hover:bg-base-300 transition-colors duration-150"
        :class="{ 'border-t border-base-300': i > 0 }">
        <!-- Index -->
        <div class="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center flex-shrink-0">
          <span class="text-[10px] font-bold text-base-content/50">{{ i + 1 }}</span>
        </div>

        <!-- Video ID + unsaved badge -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium truncate">{{ cut.videoId }}</span>
            <span v-if="!cut.id" class="badge badge-warning badge-xs">kaydedilmedi</span>
          </div>
          <!-- Mini timeline -->

          <div class="flex items-center gap-2">
            <span class="text-[10px] text-neutral-content/40 font-mono w-7 text-right">{{ formatTime(cut.startSecond)
            }}</span>
            <div class="relative flex-1 h-1 bg-neutral-content/10 rounded-full overflow-hidden">
              <div
                class="absolute top-0 h-full rounded-full bg-gradient-to-r from-success to-warning group-hover:from-primary group-hover:to-secondary transition-colors duration-300"
                :style="{ left: progressLeft(cut), width: progressWidth(cut) }" />
            </div>
            <span class="text-[10px] text-neutral-content/40 font-mono w-7">{{ formatTime(cut.endSecond) }}</span>
          </div>
        </div>

        <!-- Duration -->
        <div class="text-sm font-mono text-base-content/60 flex-shrink-0">
          {{ duration(cut) }}s
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <!-- GIF Button -->
          <button class="btn btn-ghost btn-xs gap-1 rounded-lg hover:text-primary" title="GIF Al"  @click="cutVideostore.downLoadCutVideoGif(cut.id ?? '')">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M8.5 12H7a1 1 0 100 0v-1.5" stroke-linecap="round" />
              <path d="M12 10v4" stroke-linecap="round" />
              <path d="M16 10h-2v4h2M14 12h1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text-[10px] font-semibold">GIF</span>
          </button>

          <!-- Download -->
          <button class="btn btn-ghost btn-xs btn-square rounded-lg hover:text-success" title="İndir"
            @click="cutVideostore.downLoadCutVideo(cut.id ?? '')">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <!-- Delete -->
          <button v-if="cut.id" class="btn btn-ghost btn-xs btn-square rounded-lg hover:text-error" title="Sil"
            @click="cutVideostore.deleteCutVideo(cut.id ?? '')">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
