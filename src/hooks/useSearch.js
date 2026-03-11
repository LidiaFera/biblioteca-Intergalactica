import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar busca local por título de livros.
 * @param {Array} livros - Lista completa de livros.
 * @returns {Object} { searchTerm, setSearchTerm, filteredLivros }
 */
export default function useSearch(livros = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLivros, setFilteredLivros] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLivros(livros);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = livros.filter(livro =>
        livro.titulo?.toLowerCase().includes(lowerTerm)
      );
      setFilteredLivros(filtered);
    }
  }, [searchTerm, livros]);

  return { searchTerm, setSearchTerm, filteredLivros };
}