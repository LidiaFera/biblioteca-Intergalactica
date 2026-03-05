import { BookOpen } from 'lucide-react'

export default function BookCard({ titulo, autor, imagemUrl, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 hover:border-purple-500/50 hover:scale-105"
    >
      {/* Imagem / Capa */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
        {imagemUrl ? (
          <img
            src={imagemUrl}
            alt={titulo}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400/50">
            <BookOpen size={48} />
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="p-3 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-semibold text-sm line-clamp-2">{titulo}</h3>
        <p className="text-xs text-gray-300 mt-1 line-clamp-1">{autor}</p>
      </div>

      {/* Overlay sutil no hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}