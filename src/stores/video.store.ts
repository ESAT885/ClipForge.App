import { defineStore } from "pinia";
import { fileService } from "@/services/video.service";
import type { Video } from "@/types/video.types";
export const usevideoStore = defineStore("videoStore", {

  state: () => ({
    videos: [] as Video[],
    lastvideo: null as Video | null,
    currentvideo: null as Video | null,
    process: false,
    progress: 0,
    currentstoredFileId: null as string | null,
    search: ""
  }),
  actions: {
    async uploadVideo(file: File) {
      try {
        this.process = true
        this.progress = 0

        // 1️⃣ INIT
        const initRes = await fileService.init(file.name)
        this.lastvideo = initRes
        const storedFileId = initRes?.id

        // 2️⃣ CHUNK UPLOAD
        const chunkSize = 5 * 1024 * 1024 // 5MB
        const totalChunks = Math.ceil(file.size / chunkSize)

        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize
          const end = start + chunkSize
          const chunk = file.slice(start, end)

          await fileService.uploadChunk(storedFileId, i, chunk)

          this.progress = Math.round(((i + 1) / totalChunks) * 100)
        }

        // 3️⃣ COMPLETE
        const lastvideo = await fileService.complete(storedFileId)
        this.currentvideo = lastvideo
        this.lastvideo = lastvideo

      } finally {
        this.process = false
        await this.fetchVideos()
      }
    },
    async fetchVideos() {
      try {


        const res = await fileService.getVideos()

        this.videos = res

      } catch (err) {

      } finally {
        this.process = false
      }
    },
    setCurrentVideo(video: Video) {
      this.currentvideo = video
    },

  }
})
