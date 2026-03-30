<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleRegister() {
  try {
    errorMessage.value = ''
    await authStore.register({
      userName: name.value,
      email: email.value,
      password: password.value
    })
    alert('Kayıt başarılı! Lütfen giriş yapın.')
    router.push('/login')
  } catch (err) {
      console.error(err)
    errorMessage.value = 'Kullanıcı adı veya şifre hatalı.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body gap-6">

        <div class="flex flex-col items-center gap-2">
          <div class="p-3 rounded-2xl bg-primary/10 mb-2">
            <img src="../../public/logo.png" alt="ClipForge" class="w-12 h-12 object-contain" />
          </div>
          <h1 class="text-3xl font-bold text-center">Hesap Oluştur</h1>
          <p class="text-sm text-base-content/60">Yaratıcılığını konuşturmaya başla.</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Ad Soyad</span>
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="Adın Soyadın"
              class="input input-bordered focus:input-primary w-full transition-all"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">E-posta</span>
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="örnek@mail.com"
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
              placeholder="Güçlü bir şifre seç"
              class="input input-bordered focus:input-primary w-full transition-all"
              required
            />
          </div>

          <div class="flex items-center gap-2 py-2">
            <input type="checkbox" class="checkbox checkbox-primary checkbox-sm" required />
            <span class="text-xs text-base-content/70">
              Kullanım koşullarını ve gizlilik politikasını kabul ediyorum.
            </span>
          </div>

          <button type="submit" class="btn btn-primary w-full shadow-lg rounded-full">
            Hesabı Oluştur
          </button>
        </form>

        <p class="text-center text-sm">
          Zaten üye misin?
          <router-link to="/login" class="text-primary font-bold hover:underline">Giriş Yap</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
