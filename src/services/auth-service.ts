import { LoginRequest, RegisterRequest, AuthResponse, ApiError, User, ChangePasswordRequest } from '@/types/auth'
import apiClient from '@/libs/http'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

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

  private getRolesFromJwt(token: string): string[] {
    try {
      const [, payload] = token.split('.');
      const json = JSON.parse(atob(payload));
      const roles = json.roles;
      return Array.isArray(roles) ? roles.map((r: any) => String(r)) : [];
    } catch {
      return [];
    }
  }

  private toUiRole(roles: string[] | undefined, fallback?: string): 'admin' | 'teacher' | 'student' {
    const rs = (roles || []).map((r) => r.toLowerCase());
    if (rs.includes('admin')) return 'admin';
    if (rs.includes('teacher')) return 'teacher';
    const fb = (fallback || '').toLowerCase();
    if (fb === 'admin') return 'admin';
    if (fb === 'teacher') return 'teacher';
    return 'student';
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

      // Derive roles and userId from JWT
      const userId = this.getUserIdFromJwt(accessToken)
      const rolesFromJwt = this.getRolesFromJwt(accessToken)
      let user: User | null = null
      if (userId) {
        try {
          const profileRes = await apiClient.get<any>(`/user-profiles/${userId}`)
          const p = profileRes.data.data || profileRes.data
          user = {
            id: userId,
            email: p?.email || payload.email,
            firstName: p?.full_name?.split(' ')?.slice(0, -1)?.join(' ') || '',
            lastName: p?.full_name?.split(' ')?.slice(-1)?.join(' ') || '',
            role: this.toUiRole(rolesFromJwt, p?.role),
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
          role: this.toUiRole(rolesFromJwt),
          avatar: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
      localStorage.setItem('user', JSON.stringify(user))

      return { user: user as any, accessToken, refreshToken: '' }
    } catch (error: any) {
      console.error('Login error:', error)
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Email hoặc mật khẩu không đúng')
      } else if (error.response?.status === 400) {
        throw new Error('Thông tin đăng nhập không hợp lệ')
      } else if (error.response?.status >= 500) {
        throw new Error('Lỗi server. Vui lòng thử lại sau')
      } else if (error.message.includes('Network Error')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng')
      }
      throw error
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const payload = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name,
        phone: userData.phone,
        class_name: userData.class_name,
        khoa: userData.khoa,
        msv: userData.msv,
      }
      
      // Register user
      const { data } = await apiClient.post<any>(`/auth/register`, payload)
      const accessToken = this.extractAccessToken(data)
      if (!accessToken) {
        throw new Error('No access token returned from server')
      }
      localStorage.setItem('accessToken', accessToken)

      const userId = this.getUserIdFromJwt(accessToken)
      const rolesFromJwt = this.getRolesFromJwt(accessToken)
      let user: User | null = null
      
      if (userId) {
        try {
          const profileRes = await apiClient.get<any>(`/user-profiles/${userId}`)
          const p = profileRes.data.data || profileRes.data
          user = {
            id: userId,
            email: p?.email || userData.email,
            firstName: p?.full_name?.split(' ')?.slice(0, -1)?.join(' ') || '',
            lastName: p?.full_name?.split(' ')?.slice(-1)?.join(' ') || '',
            role: this.toUiRole(rolesFromJwt, p?.role),
            avatar: p?.avatar,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          try {
            if (process.env.NEXT_PUBLIC_CREATE_MEMBER_ON_REGISTER === 'true') {
              await apiClient.post('/members', {
                userId: userId,
                name: userData.full_name,
                email: userData.email,
                role: 'Thành viên',
                class: userData.class_name,
                teams: ['Chưa phân ban'],
                status: 'active',
                joinDate: new Date().toISOString()
              })
            }
          } catch (memberError) {
            console.warn('Failed to create member record:', memberError)
          }
        } catch (profileError) {
          console.warn('Failed to fetch user profile:', profileError)
        }
      }
      
      if (!user) {
        user = {
          id: userId || '',
          email: payload.email,
          firstName: '',
          lastName: '',
          role: this.toUiRole(rolesFromJwt),
          avatar: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
      localStorage.setItem('user', JSON.stringify(user))

      return { user: user as any, accessToken, refreshToken: '' }
    } catch (error: any) {
      console.error('Register error:', error)
      // Handle specific error cases
      if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'Thông tin đăng ký không hợp lệ'
        throw new Error(message)
      } else if (error.response?.status === 409) {
        throw new Error('Email hoặc tên đăng nhập đã được sử dụng')
      } else if (error.response?.status >= 500) {
        throw new Error('Lỗi server. Vui lòng thử lại sau')
      } else if (error.message.includes('Network Error')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng')
      }
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

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      // Frontend validation
      if (!passwordData.currentPassword) {
        throw new Error('Mật khẩu hiện tại là bắt buộc')
      }
      
      if (!passwordData.newPassword) {
        throw new Error('Mật khẩu mới là bắt buộc')
      }
      
      if (!passwordData.confirmPassword) {
        throw new Error('Xác nhận mật khẩu là bắt buộc')
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Mật khẩu mới và xác nhận mật khẩu không khớp')
      }
      
      if (passwordData.newPassword.length < 6) {
        throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự')
      }
      
      if (passwordData.currentPassword === passwordData.newPassword) {
        throw new Error('Mật khẩu mới phải khác mật khẩu hiện tại')
      }

      // Get user email from stored user data
      const user = this.getStoredUser()
      
      if (!user) {
        throw new Error('User not found')
      }

      if (!user.email) {
        throw new Error('User email not found. Please log in again.')
      }

      const payload = {
        email: user.email,
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      }
      
      await apiClient.patch(`/users/${user.id}`, payload)
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
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
