import type { Video } from "@/types/video.types";
import api from "./axios";
import type { BackgroundJobStatusResponse } from "@/types/backgroundJob.types";

export const backgroundMonitorService = {


    get(): Promise<BackgroundJobStatusResponse> {
        return api.get("/BackgroundMonitors/status", {

        })
    },

};
