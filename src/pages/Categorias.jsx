import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useLivros from '../hooks/useLivros';
import useFavoritos from '../hooks/useFavoritos';
import BookCard from '../components/BookCard';
import Particles from '../components/Particles';
import Sidebar from '../components/Sidebar';
import logo from '../assets/inter.png';
import { Menu, X } from 'lucide-react';

// Função auxiliar para abrir PDF (igual ao Home)
function getDrivePreviewUrl(url) {
  if (!url) return url;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
}

export default function Categorias() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { livros, loading } = useLivros();
  const { isFavorito, addFavorito, removeFavorito } = useFavoritos(user);

  // Agrupar livros por categoria
  const livrosPorCategoria = useMemo(() => {
    const grupos = {};
    livros.forEach(livro => {
      const categoria = livro.categoria?.trim() || 'Sem categoria';
      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(livro);
    });
    // Ordenar categorias alfabeticamente
    return Object.keys(grupos)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, cat) => {
        acc[cat] = grupos[cat];
        return acc;
      }, {});
  }, [livros]);

  const handleSelectLivro = (livro) => {
    if (!livro.pdf_url) {
      alert('Este livro não possui PDF disponível.');
      return;
    }
    const previewUrl = getDrivePreviewUrl(livro.pdf_url);
    window.open(previewUrl, '_blank');
  };

  const handleToggleFavorito = (livroId) => {
    if (isFavorito(livroId)) {
      removeFavorito(livroId);
    } else {
      addFavorito(livroId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl font-light animate-pulse">
          Carregando categorias...
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

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        logo={logo}
      />

      <main className="relative z-10 lg:ml-72 p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Categorias
            </span>
          </h1>
          <p className="text-gray-300 text-lg mt-2 max-w-2xl">
            Explore livros organizados por categoria.
          </p>
        </div>

        {/* Lista de categorias */}
        <div className="space-y-12">
          {Object.entries(livrosPorCategoria).map(([categoria, livrosDaCat]) => (
            <section key={categoria}>
              <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
                <span className="w-1 h-8 bg-purple-500 mr-3 rounded-full" />
                {categoria}
                <span className="ml-3 text-sm text-gray-400 font-light">
                  ({livrosDaCat.length} livro{livrosDaCat.length !== 1 ? 's' : ''})
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {livrosDaCat.map((livro) => (
                  <BookCard
                    key={livro.id}
                    titulo={livro.titulo}
                    autor={livro.autor}
                    imagemUrl={livro.imagem_url}
                    onSelect={() => handleSelectLivro(livro)}
                    isFavorito={isFavorito(livro.id)}
                    onToggleFavorito={() => handleToggleFavorito(livro.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Caso não haja livros */}
        {Object.keys(livrosPorCategoria).length === 0 && (
          <p className="text-gray-400 text-center py-20">
            Nenhum livro encontrado.
          </p>
        )}
      </main>
    </div>
  );
}