import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import bg from '../assets/paglogin.jpg'
import logo from '../assets/IntergalaticoLogo.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isLogin) {
        await signIn(email, senha)
      } else {
        await signUp(email, senha)
        alert('Cadastro realizado! Verifique seu email para confirmação.')
        return
      }
      navigate('/') // redireciona para home após login
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative w-[92%] max-w-2xl rounded-2xl bg-white/55 backdrop-blur-md shadow-2xl border border-white/40 px-10 py-12">
        <div className="flex flex-col items-center mb-10">
          <img
            src={logo}
            alt="Intergalático Logo"
            className="w-50 h-auto object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-500/80 text-white p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full bg-white/90 px-5 py-3 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Senha:
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-full bg-white/90 px-5 py-3 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-black text-white py-3 font-semibold hover:bg-black/90 transition"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>

          <div className="text-center text-sm text-black/80 mt-6">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold underline hover:text-black transition"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}