<template>
  <dialog ref="dialog" class="modal">
    <div class="modal-box w-11/12 max-w-2xl p-0 overflow-hidden rounded-2xl border border-base-300 shadow-2xl">

      <!-- Header -->
      <div class="px-8 pt-8 pb-6 border-b border-base-200">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold tracking-tight">Yeni Video Ekle</h2>
        </div>
        <p class="text-sm text-base-content/50 pl-11">MP4</p>
      </div>

      <!-- Body -->
      <div class="px-8 py-7 space-y-6">

        <!-- Drop Zone -->
        <label class="group relative flex flex-col items-center justify-center gap-3 w-full h-44
                 rounded-xl border-2 border-dashed border-base-300 cursor-pointer
                 transition-all duration-200
                 hover:border-primary hover:bg-primary/5">
          <input type="file" hidden accept="video/*" @change="handleUpload" />

          <div class="w-12 h-12 rounded-full bg-base-200 group-hover:bg-primary/10
                      flex items-center justify-center transition-colors duration-200">
            <svg class="w-5 h-5 text-base-content/40 group-hover:text-primary transition-colors duration-200"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>

          <div class="text-center">
            <p class="text-sm font-medium text-base-content/70 group-hover:text-primary transition-colors duration-200">
              Dosyayı sürükle veya <span class="text-primary underline underline-offset-2">seç</span>
            </p>
          </div>
        </label>

        <!-- Progress -->
        <Transition enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
          <div v-if="videostore.process" class="space-y-2">
            <div class="flex items-center justify-between text-xs text-base-content/50">
              <span class="flex items-center gap-1.5">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Yükleniyor...
              </span>
              <span class="font-medium tabular-nums text-base-content">{{ videostore.progress }}%</span>
            </div>
            <progress class="progress progress-primary w-full h-1.5" :value="videostore.progress" max="100"></progress>
          </div>
        </Transition>

      </div>

      <!-- Footer -->
      <div class="px-8 pb-8 flex items-center justify-end gap-3">
        <button class="btn btn-ghost btn-sm rounded-lg" @click="close">Vazgeç</button>

      </div>

    </div>

    <!-- Backdrop -->
    <form method="dialog" class="modal-backdrop backdrop-blur-sm bg-black/30">
      <button @click="close">close</button>
    </form>
  </dialog>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"
import { usevideoStore } from "@/stores/video.store";
const dialog = ref()

const videostore = usevideoStore();

function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  if (!file) return;
  videostore.uploadVideo(file);

}
// Fonksiyonları expose ettik ki parent çağırabilsin
function open() {
  dialog.value.showModal()
}

function close() {
  dialog.value.close()
}
watch(
  [() => videostore.progress, () => videostore.process],
  ([newProgress, newProcess]) => {
    if (newProgress >= 100 && !newProcess) {
      close();
    }
  }
);
defineExpose({
  open,
  close
})
</script>
