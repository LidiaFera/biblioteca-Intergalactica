export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-white text-xl font-bold tracking-wide">
          🌌 Intergalático
        </h1>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <a href="#" className="hover:text-white transition">
            Início
          </a>
          <a href="#" className="hover:text-white transition">
            Explorar
          </a>
          <a href="#" className="hover:text-white transition">
            Admin
          </a>
        </div>

      </div>
    </nav>
  );
}