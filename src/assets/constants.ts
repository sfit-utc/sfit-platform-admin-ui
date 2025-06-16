// Asset paths constants
export const ASSETS_PATH = {
  ICONS: {
    LOGO: '/src/assets/icons/logo.svg',
    FAVICON: '/src/assets/icons/favicon.ico',
    APPLE_TOUCH_ICON: '/src/assets/icons/apple-touch-icon.png',
  },
  
  IMAGES: {
    AUTH: {
      LOGIN_ILLUSTRATION: '/src/assets/images/auth/login-illustration.svg',
      REGISTER_ILLUSTRATION: '/src/assets/images/auth/register-illustration.svg',
      AUTH_BACKGROUND: '/src/assets/images/auth/auth-background.jpg',
    },
    
    DASHBOARD: {
      HERO: '/src/assets/images/dashboard/dashboard-hero.jpg',
      STUDENT_AVATAR: '/src/assets/images/dashboard/student-avatar.png',
      TEACHER_AVATAR: '/src/assets/images/dashboard/teacher-avatar.png',
    },
    
    LANDING: {
      HERO: '/src/assets/images/landing/hero-image.svg',
      FEATURE_1: '/src/assets/images/landing/features-1.jpg',
      FEATURE_2: '/src/assets/images/landing/features-2.jpg',
      FEATURE_3: '/src/assets/images/landing/features-3.jpg',
    },
  },
  
  ILLUSTRATIONS: {
    STUDY_ONLINE: '/src/assets/illustrations/study-online.svg',
    COLLABORATION: '/src/assets/illustrations/collaboration.svg',
    ACHIEVEMENT: '/src/assets/illustrations/achievement.svg',
  },
} as const

// Helper function to get asset path
export const getAssetPath = (path: string): string => {
  return path.startsWith('/') ? path : `/${path}`
}

// Placeholder image for development
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTQwSDE4NVYxNjBIMjE1VjE0MEgyMjVWMTcwSDIxNVYxODBIMTg1VjE3MEgxNzVWMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'

export default ASSETS_PATH
