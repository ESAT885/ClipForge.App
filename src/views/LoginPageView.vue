<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const userName = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  try {
    loading.value = true
    errorMessage.value = ''

    await authStore.login({
      userName: userName.value,
      password: password.value,
    })

    // 🔥 KRİTİK KONTROL
    if (!authStore.accessToken) {
      throw new Error('Token alınamadı')
    }

    await router.replace('/')
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Kullanıcı adı veya şifre hatalı.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl overflow-hidden">
      <div class="card-body gap-6">

        <div class="flex flex-col items-center gap-2">
          <div class="p-3 rounded-2xl bg-primary/10 mb-2">
            <img src="../../public/logo.png" alt="ClipForge" class="w-12 h-12 object-contain" />
          </div>
          <h1 class="text-3xl font-bold text-center">Tekrar Hoş Geldin!</h1>
          <p class="text-sm text-base-content/60">ClipForge ile videolarını yönetmeye devam et.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Kullanıcı Adı</span>
            </label>
            <input
              v-model="userName"
              type="text"
              placeholder="Kullanıcı adını gir"
              class="input input-bordered focus:input-primary w-full transition-all"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Şifre</span>
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="input input-bordered focus:input-primary w-full transition-all"
              required
            />
            <label class="label">
              <a href="#" class="label-text-alt link link-hover text-primary">Şifremi unuttum</a>
            </label>
          </div>

          <button type="submit" class="btn btn-primary w-full shadow-lg rounded-full mt-2">
            Giriş Yap
          </button>
        </form>

        <div class="divider text-xs text-base-content/40 uppercase">Veya</div>

        <p class="text-center text-sm">
          Hesabın yok mu?
          <router-link to="/register" class="text-primary font-bold hover:underline">Hemen Kaydol</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
