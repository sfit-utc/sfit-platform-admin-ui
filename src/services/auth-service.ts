import { LoginRequest, RegisterRequest, AuthResponse, ApiError, User } from '@/types/auth'
import apiClient from '@/libs/http'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

class AuthService {
  private extractAccessToken(resp: any): string | null {
    if (!resp) return null;
    // Direct string
    if (typeof resp === 'string') return resp;
    // Common wrappers
    if (typeof resp?.accessToken === 'string') return resp.accessToken;
    if (typeof resp?.data === 'string') return resp.data;
    if (typeof resp?.data?.accessToken === 'string') return resp.data.accessToken;
    // Backend response format: { data: "token", message: "...", status: "..." }
    if (typeof resp?.data === 'string' && resp?.status === 'success') return resp.data;
    return null;
  }
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const payload = {
        username: (credentials as any).username || credentials.email,
        email: credentials.email,
        password: credentials.password,
      }
      const { data } = await apiClient.post<any>(
        `/auth/login`,
        payload
      )
      // Extract access token from possible wrapper shapes
      const accessToken = this.extractAccessToken(data)
      if (!accessToken) {
        throw new Error('No access token returned from server')
      }
      localStorage.setItem('accessToken', accessToken)

      // Derive userId from JWT (sub) and fetch profile
      const userId = this.getUserIdFromJwt(accessToken)
      let user: User | null = null
      if (userId) {
        try {
          const profileRes = await apiClient.get<any>(`/user-profiles/${userId}`)
          const p = profileRes.data
          user = {
            id: userId,
            email: p?.email || '',
            firstName: p?.full_name?.split(' ')?.slice(0, -1)?.join(' ') || '',
            lastName: p?.full_name?.split(' ')?.slice(-1)?.join(' ') || '',
            role: 'student',
            avatar: p?.avatar,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        } catch {}
      }
      
      if (!user) {
        user = {
          id: userId || '',
          email: payload.email,
          firstName: '',
          lastName: '',
          role: 'student',
          avatar: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
      localStorage.setItem('user', JSON.stringify(user))

      return { user: user as any, accessToken, refreshToken: '' }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const usernameFromEmail = userData.email?.split('@')[0] || ''
      const fallbackUsername = `${userData.firstName || ''}${userData.lastName || ''}`.replace(/\s+/g, '')
      const payload = {
        username: (userData as any).username || usernameFromEmail || fallbackUsername,
        email: userData.email,
        password: userData.password,
      }
      const { data } = await apiClient.post<any>(`/auth/register`, payload)
      const accessToken = this.extractAccessToken(data)
      if (!accessToken) {
        throw new Error('No access token returned from server')
      }
      localStorage.setItem('accessToken', accessToken)

      const userId = this.getUserIdFromJwt(accessToken)
      let user: User | null = null
      if (userId) {
        try {
          const profileRes = await apiClient.get<any>(`/user-profiles/${userId}`)
          const p = profileRes.data
          user = {
            id: userId,
            email: p?.email || '',
            firstName: p?.full_name?.split(' ')?.slice(0, -1)?.join(' ') || '',
            lastName: p?.full_name?.split(' ')?.slice(-1)?.join(' ') || '',
            role: 'student',
            avatar: p?.avatar,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        } catch {}
      }
      if (!user) {
        user = {
          id: userId || '',
          email: payload.email,
          firstName: '',
          lastName: '',
          role: 'student',
          avatar: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
      localStorage.setItem('user', JSON.stringify(user))

      return { user: user as any, accessToken, refreshToken: '' }
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (refreshToken) {
        await apiClient.post(`/auth/logout`, { refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  async refreshToken(): Promise<string> {
    try {
      // Backend reads refresh token from httpOnly cookie; send credentials
      const { data } = await apiClient.post<any>(
        `/auth/refresh`,
        undefined,
        { withCredentials: true }
      )
      const accessToken = this.extractAccessToken(data)
      if (!accessToken) {
        throw new Error('No access token returned from server')
      }
      localStorage.setItem('accessToken', accessToken)
      
      return accessToken
    } catch (error) {
      console.error('Token refresh error:', error)
      // If refresh fails, logout user
      this.logout()
      throw error
    }
  }

  getStoredUser() {
    try {
      const userString = localStorage.getItem('user')
      return userString ? JSON.parse(userString) : null
    } catch (error) {
      console.error('Error parsing stored user:', error)
      return null
    }
  }

  getStoredToken() {
    return localStorage.getItem('accessToken')
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken()
    const user = this.getStoredUser()
    return !!(token && user)
  }

  private getUserIdFromJwt(token: string): string | null {
    try {
      const [, payload] = token.split('.')
      const json = JSON.parse(atob(payload))
      return json.sub || json.user_id || null
    } catch {
      return null
    }
  }
}

export const authService = new AuthService()
