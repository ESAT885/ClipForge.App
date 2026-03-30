import api from "./axios";
export const authService = {
  async login(data: { userName: string; password: string }): Promise<{ accessToken: string }> {

    return await api.post('/auth/login', data)
  },


  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await api.post('/auth/refreshToken')
    return response.data
  },

  async register(data: {
    userName: string
    password: string
  }): Promise<{ accessToken: string }> {

    return await api.post('/auth/register', data)
  }
}

