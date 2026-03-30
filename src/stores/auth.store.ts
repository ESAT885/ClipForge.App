import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'

interface LoginRequest {
  userName: string
  password: string
}

interface LoginResponse {
  accessToken: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    userName: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setToken(token: string) {
      this.accessToken = token
    },

    clearAuth() {
      this.accessToken = null
      this.userName = null
    },

    async login(payload: LoginRequest): Promise<void> {
      try {

        const response: LoginResponse = await authService.login(payload)

        this.setToken(response.accessToken)
      } catch (err) {
        console.error('Giriş hatası:', err)
      } finally {
        console.log('Login işlemi tamamlandı.')
      }
    },

    async register(payload: { userName: string; email: string; password: string }) {
      try {
        const response = await authService.register(payload)
        this.setToken(response.accessToken) // Token'ı Pinia'da sakla
      } catch (err) {
        console.error('Kayıt hatası:', err)
        throw err
      }
    },
    async refreshToken(): Promise<void> {

      const response = await authService.refreshToken()
      this.setToken(response.accessToken)
    },

    async logout() {
      this.clearAuth()
    }
  }
})
