import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    const loginResult = await onLogin({
      password,
      username: username.trim(),
    })

    if (!loginResult.success) {
      setErrorMessage(loginResult.message)
      setPassword('')
      setIsSubmitting(false)
      return
    }

    setErrorMessage('')
    setIsSubmitting(false)
  }

  return (
    <main className="login-page">
      <ThemeToggle />

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-copy">
          <p className="eyebrow">Weather Analytics Pipeline</p>
          <h1 id="login-title">Acesse o dashboard</h1>
          <p className="subtitle">
            Entre com seu usuário e senha para visualizar os indicadores meteorológicos.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Login
            <input
              autoComplete="username"
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Digite seu login"
              type="text"
              value={username}
            />
          </label>

          <label>
            Senha
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              type="password"
              value={password}
            />
          </label>

          {errorMessage && (
            <p className="login-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Validando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginScreen
