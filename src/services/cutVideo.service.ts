import type { Video } from "@/types/video.types";

import api from "./axios";
import type { CutVideo } from "@/types/cutVideo.types";
import type { CutVideoRequest } from "@/types/CutVideoRequest.types";
export const cutVideoService = {
  cutVideo(cutVideoRequest: CutVideoRequest): Promise<CutVideo> {
    return api.post("/CutVideos/cut", cutVideoRequest);
  },
  getListByVideoId(videoId: string): Promise<CutVideo[]> {
    return api.get(`/CutVideos/${videoId}`, {
    })
  },
  deleteCutVideo(cutVideoId: string): Promise<void> {
    return api.delete(`/CutVideos/${cutVideoId}`)
  },
  downloadCutVideo(cutVideoId: string) {

    return import.meta.env.VITE_API_URL + `/CutVideos/downloadVideo/${cutVideoId}`
  },
  downloadCutVideoGif(cutVideoId: string) {

    return import.meta.env.VITE_API_URL + `/CutVideos/downloadGif/${cutVideoId}`
  }
}
