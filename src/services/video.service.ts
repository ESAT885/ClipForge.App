import type { Video } from "@/types/video.types";
import api from "./axios";

export const fileService = {

    init(fileName: string): Promise<Video> {
        return api.post("/Videos/init", null, {
            params: { fileName }
        });
    },

    uploadChunk(videoId: string, index: number, file: Blob) {
        const form = new FormData();
        form.append("videoId", videoId);
        form.append("index", index.toString());
        form.append("file", file);

        return api.post("/Videos/chunk", form);
    },

    complete(videoId: string): Promise<Video> {
        return api.post("/Videos/complete/"+videoId);
    },
    getVideos(): Promise<Video[]> {
        return api.get("/Videos", {

        })
    },

};
