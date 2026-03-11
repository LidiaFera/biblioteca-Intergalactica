import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useFavoritos from '../hooks/useFavoritos';
import useLivros from '../hooks/useLivros';
import Particles from '../components/Particles';
import Sidebar from '../components/Sidebar';
import BookCard from '../components/BookCard';
import { User, Mail, LogOut, Edit2, Save, X, Menu } from 'lucide-react';
import logo from '../assets/inter.png';

export default function MinhaConta() {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { livros } = useLivros();
  const { favoritosMap, getFavoritosLivros } = useFavoritos(user);
  const favoritos = getFavoritosLivros(livros);

  // Estado para edição de perfil (simulado)
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.name || 'Usuário');
  const [tempName, setTempName] = useState(displayName);

  // Estatísticas simuladas (substitua por dados reais se necessário)
  const totalFavoritos = favoritos.length;
  const totalLeituras = 12; // mock
  const categoriasCount = {
    'Ficção': 5,
    'Fantasia': 3,
    'Ciência': 2,
    'História': 4,
    'Tecnologia': 1
  };
  const maxCount = Math.max(...Object.values(categoriasCount));

  const handleSaveName = () => {
    setDisplayName(tempName);
    setEditMode(false);
    // Aqui você pode integrar com uma API para salvar o nome
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const handleOpenPdf = (livro) => {
    if (!livro.pdf_url) return;
    const match = livro.pdf_url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const previewUrl = match
      ? `https://drive.google.com/file/d/${match[1]}/preview`
      : livro.pdf_url;
    window.open(previewUrl, '_blank');
  };

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
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white flex items-center gap-3">
            <User size={40} className="text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Minha Conta
            </span>
          </h1>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card do perfil */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Perfil</h2>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <Edit2 size={20} />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveName}
                    className="text-green-400 hover:text-green-300 transition"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setTempName(displayName);
                    }}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                {editMode ? (
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-black/50 border border-white/20 rounded px-2 py-1 text-white w-full"
                    placeholder="Seu nome"
                  />
                ) : (
                  <span>{displayName}</span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-600/30 hover:bg-red-600/50 text-white py-2 rounded-lg border border-red-400/30 transition flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>

          {/* Card de estatísticas */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Estatísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{totalFavoritos}</div>
                <div className="text-sm text-gray-400">Livros favoritos</div>
              </div>
              <div className="bg-pink-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-pink-400">{totalLeituras}</div>
                <div className="text-sm text-gray-400">Leituras realizadas</div>
              </div>
            </div>

            {/* Gráfico de barras simples */}
            <div className="mt-6">
              <h3 className="text-lg text-white mb-3">Categorias favoritas</h3>
              <div className="space-y-3">
                {Object.entries(categoriasCount).map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>{cat}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seção de livros favoritos */}
        <div>
          <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
            <span className="w-1 h-8 bg-purple-500 mr-3 rounded-full" />
            Meus livros favoritos
          </h2>
          {favoritos.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              Você ainda não favoritou nenhum livro.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {favoritos.map((livro) => (
                <BookCard
                  key={livro.id}
                  titulo={livro.titulo}
                  autor={livro.autor}
                  imagemUrl={livro.imagem_url}
                  onSelect={() => handleOpenPdf(livro)}
                  isFavorito={true}
                  // Se quiser permitir remover favoritos diretamente daqui, implemente onToggleFavorito
                  // onToggleFavorito={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}