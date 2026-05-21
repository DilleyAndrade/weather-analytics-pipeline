import { useEffect, useState } from 'react'
import './ThemeToggle.css'

function getPreferredTheme() {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme) {
    return savedTheme === 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(getPreferredTheme)

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light'

    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [isDarkMode])

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => setIsDarkMode((currentTheme) => !currentTheme)}
      title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
      aria-pressed={isDarkMode}
    >
      {isDarkMode ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
          <path
            d="M12 4V2M12 22v-2M4.93 4.93 3.51 3.51M20.49 20.49l-1.42-1.42M4 12H2M22 12h-2M4.93 19.07l-1.42 1.42M20.49 3.51l-1.42 1.42"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
          <path
            d="M21 12.79A8.5 8.5 0 1 1 11.21 3 6.7 6.7 0 0 0 21 12.79Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
