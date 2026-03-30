import { defineStore } from "pinia";
import { backgroundMonitorService } from "@/services/backgroundmonitor.service";
import type { BackgroundJobStatusResponse } from "@/types/backgroundJob.types";

export const useBackgroundMonitorStore = defineStore("BackgroundMonitorStore", {
  state: (): { backgroundJobStatusResponsevalue: BackgroundJobStatusResponse } => ({
    backgroundJobStatusResponsevalue: {
      queueCount: 0,
      active: [],
      completed: [],
      failed: [],
    },
  }),
  actions: {
    async fetchBackgroundJobStatus() {
      try {
        const res = await backgroundMonitorService.get();
        // res JSON geldiyse direkt atayabilirsin
        this.backgroundJobStatusResponsevalue = res;
      } catch (err) {
        console.error(err);
      }
    },
  },
});
