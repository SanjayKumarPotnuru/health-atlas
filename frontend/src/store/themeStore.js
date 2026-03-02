import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'light' | 'dark'
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', newTheme)
        set({ theme: newTheme })
      },

      initTheme: () => {
        const theme = get().theme
        document.documentElement.setAttribute('data-theme', theme)
      }
    }),
    {
      name: 'theme-storage'
    }
  )
)
