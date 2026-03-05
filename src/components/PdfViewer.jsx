import { useState } from 'react'

export default function PdfViewer({ pdfUrl, onClose }) {
  if (!pdfUrl) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-11/12 h-5/6 bg-white/90 rounded-xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:bg-red-600"
        >
          &times;
        </button>
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title="Visualizador de PDF"
          allow="autoplay"
        />
      </div>
    </div>
  )
}