import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import BookCard from '../components/BookCard';
import Particles from '../components/Particles';
import Sidebar from '../components/Sidebar';
import useFavoritos from '../hooks/useFavoritos';
import logo from '../assets/inter.png';
import { Menu, X } from 'lucide-react';

export default function Favoritos() {
  const { user } = useAuth();
  const [livros, setLivros] = useState([]);
  const [loadingLivros, setLoadingLivros] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { favoritosMap, addFavorito, removeFavorito, isFavorito } = useFavoritos(user);

  // Buscar todos os livros (ou apenas os favoritos, dependendo da necessidade)
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
      setLoadingLivros(false);
    }
    fetchLivros();
  }, []);

  // Filtrar apenas os livros favoritos
  const livrosFavoritos = livros.filter(livro => favoritosMap.has(livro.id));

  const handleSelectLivro = (livro) => {
    if (!livro.pdf_url) {
      alert('Este livro não possui PDF disponível.');
      return;
    }
    // Função para converter link do drive (pode ser extraída para um utils)
    const getDrivePreviewUrl = (url) => {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
    };
    window.open(getDrivePreviewUrl(livro.pdf_url), '_blank');
  };

  const handleToggleFavorito = (livroId) => {
    if (isFavorito(livroId)) {
      removeFavorito(livroId);
    } else {
      addFavorito(livroId);
    }
  };

  if (loadingLivros) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl font-light animate-pulse">
          Carregando favoritos...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Particles quantity={200} color="#ffffff" className="opacity-60" />

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

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        logo={logo}
      />

      <main className="relative z-10 lg:ml-72 p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white">
            Meus{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Favoritos
            </span>
          </h1>
          <p className="text-gray-300 text-lg mt-2 max-w-2xl">
            Seus livros favoritos guardados em um só lugar.
          </p>
        </div>

        {livrosFavoritos.length === 0 ? (
          <div className="text-center text-gray-400 text-xl mt-20">
            Nenhum livro favoritado ainda. Explore a biblioteca e favorite seus livros!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {livrosFavoritos.map((livro) => (
              <BookCard
                key={livro.id}
                titulo={livro.titulo}
                autor={livro.autor}
                imagemUrl={livro.imagem_url}
                onSelect={() => handleSelectLivro(livro)}
                isFavorito={true}
                onToggleFavorito={() => handleToggleFavorito(livro.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}