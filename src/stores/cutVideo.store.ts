import { defineStore } from "pinia";
import { cutVideoService } from "@/services/cutVideo.service";
import type { CutVideoRequest } from "@/types/CutVideoRequest.types";
import type { CutVideo } from "@/types/cutVideo.types";
export const usecutVideoStore = defineStore("cutVideoStore", {

  state: () => ({
    process: false,
    videoId: null as string | null,
    cutVideos: [] as CutVideo[],

  }),
  actions: {
    async cutVideo(cutVideoRequest: CutVideoRequest) {
      try {
        this.process = true
        
        const res = await cutVideoService.cutVideo(cutVideoRequest)

        await this.fetchCutVideos()
      } catch (err) {

      } finally {
        this.process = false
      }
    },
    async fetchCutVideos() {
      try {

        if (!this.videoId) return []
        const res = await cutVideoService.getListByVideoId(this.videoId)

        this.cutVideos = res

      } catch (err) {

      } finally {
        this.process = false
      }
    },
    async deleteCutVideo(cutVideoId: string) {
      try {
        this.process = true
        await cutVideoService.deleteCutVideo(cutVideoId)
        await this.fetchCutVideos()
      } catch (err) { } finally {
        this.process = false
      }
    },
    async downLoadCutVideo(cutVideoId: string) {
      try {

        this.process = true

        const res = await cutVideoService.downloadCutVideo(cutVideoId)

          window.location.href = res

      } catch (err) {
        console.error(err)
      } finally {
        this.process = false
      }
    },
     async downLoadCutVideoGif(cutVideoId: string) {
      try {

        this.process = true

        const res = await cutVideoService.downloadCutVideoGif(cutVideoId)

          window.location.href = res

      } catch (err) {
        console.error(err)
      } finally {
        this.process = false
      }
    }
  }
})
