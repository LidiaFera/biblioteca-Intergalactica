import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpen, Star, User, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose, user, logo }) {
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: HomeIcon, label: 'Início', path: '/' },
    { icon: BookOpen, label: 'Categorias', path: '/categorias' },
    { icon: Star, label: 'Favoritos', path: '/favoritos' },
    { icon: User, label: 'Minha Conta', path: '/minha-conta' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex flex-col h-full p-6 text-white">
        <button onClick={onClose} className="lg:hidden self-end mb-4">
          <X size={24} />
        </button>

        <div className="mb-12 mt-8">
          <img src={logo} alt="Intergalático" className="w-32 h-auto" />
          <p className="text-sm text-gray-300 mt-1">Biblioteca Virtual</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-purple-600/30 text-white border-l-4 border-purple-400'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
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
  );
}