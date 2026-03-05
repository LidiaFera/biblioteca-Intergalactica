import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import BookCard from '../components/BookCard';
import Particles from '../components/Particles';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/inter.png';
import { Menu, X, Search, HomeIcon, BookOpen, Star, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Função para converter link do Google Drive em link de visualização
function getDrivePreviewUrl(url) {
  if (!url) return url;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
}

export default function Home() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const [livros, setLivros] = useState([]);
  const [lendoAtualmente, setLendoAtualmente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLivros, setFilteredLivros] = useState([]);

  // Buscar livros do Supabase
  useEffect(() => {
    async function fetchLivros() {
      const { data, error } = await supabase
        .from('livros')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar livros:', error);
      } else {
        setLivros(data || []);
      }
      setLoading(false);
    }
    fetchLivros();
  }, []);

  // Buscar leituras do usuário logado
  useEffect(() => {
    if (!user || livros.length === 0) return;

    async function fetchLeituras() {
      const { data, error } = await supabase
        .from('leituras')
        .select('livro_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar leituras:', error);
      } else {
        const ids = data.map(item => item.livro_id);
        const livrosLidos = livros.filter(livro => ids.includes(livro.id));
        setLendoAtualmente(livrosLidos.slice(0, 6));
      }
    }
    fetchLeituras();
  }, [user, livros]);

  // Filtro de busca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLivros(livros);
    } else {
      const filtered = livros.filter(livro =>
        livro.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLivros(filtered);
    }
  }, [searchTerm, livros]);

  const handleSelectLivro = async (livro) => {
    if (!livro.pdf_url) {
      alert('Este livro não possui PDF disponível.');
      return;
    }
    const previewUrl = getDrivePreviewUrl(livro.pdf_url);
    window.open(previewUrl, '_blank');

    if (user) {
      const { error } = await supabase
        .from('leituras')
        .upsert(
          { user_id: user.id, livro_id: livro.id },
          { onConflict: 'user_id, livro_id' }
        );
      if (error) console.error('Erro ao registrar leitura:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const menuItems = [
    { icon: HomeIcon, label: 'Início', path: '/', active: location.pathname === '/' },
    { icon: BookOpen, label: 'Categorias', path: '/categorias', active: location.pathname === '/categorias' },
    { icon: Star, label: 'Favoritos', path: '/favoritos', active: location.pathname === '/favoritos' },
    { icon: User, label: 'Minha Conta', path: '/minha-conta', active: location.pathname === '/minha-conta' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl font-light animate-pulse">
          Carregando biblioteca galáctica...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Particles quantity={200} color="#ffffff" className="opacity-60" />

      {/* Botão menu mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 bg-white/10 backdrop-blur-md p-3 rounded-full text-white border border-white/20"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

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
          <div className="mb-12 mt-8">
            <img src={logo} alt="Intergalático" className="w-32 h-auto" />
            <p className="text-sm text-gray-300 mt-1">Biblioteca Virtual</p>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? 'bg-purple-600/30 text-white border-l-4 border-purple-400'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

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
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white">
            Os melhores{' '}
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              livros
            </span>
          </h1>
          <p className="text-gray-300 text-lg mt-2 max-w-2xl">
            Explore nossa coleção galáctica de conhecimento e aventura.
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Buscar livro por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Seção "Continuar Lendo" (aparece apenas se houver livros lidos) */}
        {lendoAtualmente.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
              <span className="w-1 h-8 bg-green-500 mr-3 rounded-full"></span>
              Continuar Lendo
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {lendoAtualmente.map((livro) => (
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
        )}

        {/* Seção "Todos os Livros" */}
        <section>
          <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
            <span className="w-1 h-8 bg-pink-500 mr-3 rounded-full"></span>
            Todos os Livros
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredLivros.map((livro) => (
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
  );
}