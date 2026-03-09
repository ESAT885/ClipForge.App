<template>
  <dialog ref="dialog" class="modal">
    <div class="modal-box w-11/12 max-w-4xl">

      <h3 class="font-bold text-lg mb-4">
        {{ title }}
      </h3>

      <video
        v-if="src"
        controls
        autoplay
        class="w-full rounded"
      >
        <source :src="src" type="video/mp4" />
      </video>

      <div class="modal-action">
        <button class="btn" @click="close">
          Kapat
        </button>
      </div>

    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"

const dialog = ref()
 defineProps<{
  src: string
  title: string
}>()



// Fonksiyonları expose ettik ki parent çağırabilsin
function open() {
  dialog.value.showModal()
}

function close() {
  dialog.value.close()
}

defineExpose({
  open,
  close
})
</script>
