import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BookCard from '../components/BookCard'
import Particles from '../components/Particles'
import { useAuth } from '../contexts/AuthContext'
import logo from '/src/assets/inter.png'
import { Menu, X, Search, HomeIcon, BookOpen, Star, Printer, User, HelpCircle } from 'lucide-react'

// Função para converter link do Google Drive em link de visualização
function getDrivePreviewUrl(url) {
  if (!url) return url
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`
  }
  return url
}

export default function Home() {
  const [livros, setLivros] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    async function fetchLivros() {
      const { data, error } = await supabase
        .from('livros')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar livros:', error)
      } else {
        setLivros(data)
      }
      setLoading(false)
    }

    fetchLivros()
  }, [])

  const handleSelectLivro = (livro) => {
    if (livro.pdf_url) {
      const previewUrl = getDrivePreviewUrl(livro.pdf_url)
      window.open(previewUrl, '_blank')
    } else {
      alert('Este livro não possui PDF disponível.')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao sair:', error)
    }
  }

  const menuItems = [
    { icon: HomeIcon, label: 'Início', active: true },
    { icon: BookOpen, label: 'Categorias' },
    { icon: Star, label: 'Favoritos' },
    { icon: Printer, label: 'Quotas de impressão' },
    { icon: User, label: 'Minha Conta' },
    { icon: Search, label: 'Busca Avançada' },
    { icon: HelpCircle, label: 'Ajuda' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl font-light animate-pulse">Carregando biblioteca galáctica...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Partículas de fundo (estrelas) */}
      <Particles quantity={200} color="#ffffff" className="opacity-60" />

      {/* Botão do menu mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 bg-white/10 backdrop-blur-md p-3 rounded-full text-white border border-white/20"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para mobile quando menu aberto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-6 text-white">
          {/* Logo / Título */}
          <div className="mb-12 mt-8">
            <img src={logo} alt="Imagem" />
            <p className="text-sm text-gray-300 mt-1">Biblioteca Virtual</p>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? 'bg-purple-600/30 text-white border-l-4 border-purple-400'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Rodapé do menu */}
          <div className="pt-6 border-t border-white/20">
            <div className="flex items-center space-x-3 text-sm text-gray-300">
              <User size={18} />
              <span className="truncate">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-600/30 hover:bg-red-600/50 text-white py-2 rounded-lg border border-red-400/30 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="relative z-10 lg:ml-72 p-6 md:p-10">
        {/* Cabeçalho com saudação */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white">
            Os melhores{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              livros
            </span>
          </h1>
          <p className="text-gray-300 text-lg mt-2 max-w-2xl">
            Explore nossa coleção galáctica de conhecimento e aventura.
          </p>
        </div>

        {/* Seção "Lendo" (destaque) */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
            <span className="w-1 h-8 bg-purple-500 mr-3 rounded-full"></span>
            Continuar Lendo
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {livros.slice(0, 6).map((livro) => (
              <BookCard
                key={livro.id}
                titulo={livro.titulo}
                autor={livro.autor}
                imagemUrl={livro.imagem_url}
                onSelect={() => handleSelectLivro(livro)}
              />
            ))}
          </div>
        </section>

        {/* Seção "Todos os Livros" */}
        <section>
          <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
            <span className="w-1 h-8 bg-pink-500 mr-3 rounded-full"></span>
            Todos os Livros
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {livros.map((livro) => (
              <BookCard
                key={livro.id}
                titulo={livro.titulo}
                autor={livro.autor}
                imagemUrl={livro.imagem_url}
                onSelect={() => handleSelectLivro(livro)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}