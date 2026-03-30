<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8 bg-base-100 min-h-screen">
    <div class="flex justify-between items-center border-b border-base-300 pb-5">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-base-content">Arka Plan İşleri</h1>
        <p class="text-base-content/60 mt-1">Sistem üzerindeki aktif ve tamamlanmış görevlerin takibi.</p>
      </div>
      <button
        @click="backgroundMonitorStore.fetchBackgroundJobStatus()"
        class="btn btn-primary btn-sm md:btn-md gap-2 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        Yenile
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stats shadow bg-base-200 overflow-hidden border border-base-300">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div class="stat-title font-medium text-base-content/70">Sırada Bekleyen</div>
          <div class="stat-value text-primary">1</div>
          <div class="stat-desc text-base-content/50">İşlenmeyi bekliyor</div>
        </div>
      </div>

      <div class="stats shadow bg-base-200 overflow-hidden border border-base-300">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <span class="loading loading-ring loading-md text-secondary"></span>
          </div>
          <div class="stat-title font-medium text-base-content/70">Aktif İşler</div>
          <div class="stat-value text-secondary">2</div>
          <div class="stat-desc text-base-content/50">Şu an çalışan</div>
        </div>
      </div>

      <div class="stats shadow bg-base-200 overflow-hidden border border-base-300">
        <div class="stat">
          <div class="stat-figure text-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div class="stat-title font-medium text-base-content/70">Hatalı İşler</div>
          <div class="stat-value text-error">{{ backgroundMonitorStore.backgroundJobStatusResponsevalue.failed?.length || 0 }}</div>
          <div class="stat-desc text-base-content/50">Müdahale gerekebilir</div>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <div class="flex items-center gap-2 mb-6">
        <h2 class="text-xl font-bold text-base-content">Bitmiş İşler Geçmişi</h2>
        <div class="badge badge-outline opacity-50">{{ backgroundMonitorStore.backgroundJobStatusResponsevalue.completed?.length || 0 }} Kayıt</div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div v-for="job in backgroundMonitorStore.backgroundJobStatusResponsevalue.completed" :key="job.id"
          class="group relative overflow-hidden card bg-base-200/50 border border-base-300 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">

          <div class="absolute left-0 top-0 h-full w-1" :class="statusColorClass(job.status)"></div>

          <div class="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h3 class="font-bold text-base-content text-lg leading-tight">{{ job.name }}</h3>
                <span class="badge badge-sm font-mono opacity-60">#{{ job.id.toString().slice(-6) }}</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs md:text-sm text-base-content/70">
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span>Oluşturma: {{ formatDate(job.createdAt) }}</span>
                </div>
                <!-- <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span>Süre: {{ job.executionDurationSeconds?.toFixed(2) }}s</span>
                </div> -->
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span>Bitiş: {{ formatDate(job.finishedAt ?? '') }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4">
               <div :class="statusBadgeClass(job.status)" class="badge badge-md gap-1 py-3 px-4 font-semibold">
                {{ jobStatusText(job.status) }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="!backgroundMonitorStore.backgroundJobStatusResponsevalue.completed?.length"
          class="flex flex-col items-center justify-center p-12 bg-base-200/30 rounded-xl border-2 border-dashed border-base-300">
          <p class="text-base-content/50 italic">Henüz tamamlanmış bir iş bulunmuyor.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBackgroundMonitorStore } from "@/stores/backgroundmonitor.store";
import { JobStatus } from "@/types/backgroundJob.types";
import { onMounted } from "vue";

const backgroundMonitorStore = useBackgroundMonitorStore();

onMounted(() => {
  backgroundMonitorStore.fetchBackgroundJobStatus();
});

function jobStatusText(status: JobStatus): string {
  const texts = {
    [JobStatus.Queued]: "Sırada",
    [JobStatus.Running]: "Çalışıyor",
    [JobStatus.Completed]: "Başarılı",
    [JobStatus.Failed]: "Hata",
  };
  return texts[status] || "Bilinmiyor";
}

function statusColorClass(status: JobStatus): string {
  switch (status) {
    case JobStatus.Completed: return "bg-success";
    case JobStatus.Running: return "bg-info";
    case JobStatus.Failed: return "bg-error";
    default: return "bg-base-content/20";
  }
}

function statusBadgeClass(status: JobStatus): string {
  switch (status) {
    case JobStatus.Completed: return "badge-success text-success-content";
    case JobStatus.Running: return "badge-info text-info-content animate-pulse";
    case JobStatus.Failed: return "badge-error text-error-content text-white";
    default: return "badge-ghost";
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: 'short'
  });
}
</script>
