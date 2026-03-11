import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook para gerenciar os favoritos do usuário.
 * @param {Object} user - Objeto do usuário autenticado.
 * @returns {Object} Funções e estado relacionados aos favoritos.
 */
export default function useFavoritos(user) {
  const [favoritosMap, setFavoritosMap] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca os IDs dos livros favoritos do usuário
  useEffect(() => {
    if (!user) {
      setFavoritosMap(new Set());
      setLoading(false);
      return;
    }

    const fetchFavoritos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('favoritos')
          .select('livro_id')
          .eq('user_id', user.id);

        if (error) throw error;
        setFavoritosMap(new Set(data.map(item => item.livro_id)));
      } catch (err) {
        console.error('Erro ao buscar favoritos:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [user]);

  // Adiciona um livro aos favoritos
  const addFavorito = async (livroId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('favoritos')
        .insert({ user_id: user.id, livro_id: livroId });

      if (error) throw error;
      setFavoritosMap(prev => new Set(prev).add(livroId));
    } catch (err) {
      console.error('Erro ao adicionar favorito:', err.message);
    }
  };

  // Remove um livro dos favoritos
  const removeFavorito = async (livroId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', user.id)
        .eq('livro_id', livroId);

      if (error) throw error;
      setFavoritosMap(prev => {
        const newSet = new Set(prev);
        newSet.delete(livroId);
        return newSet;
      });
    } catch (err) {
      console.error('Erro ao remover favorito:', err.message);
    }
  };

  // Verifica se um livro é favorito
  const isFavorito = (livroId) => favoritosMap.has(livroId);

  // Retorna a lista de livros favoritos (com base em uma lista completa de livros)
  const getFavoritosLivros = (livros) => {
    return livros.filter(livro => favoritosMap.has(livro.id));
  };

  return {
    favoritosMap,
    loading,
    error,
    addFavorito,
    removeFavorito,
    isFavorito,
    getFavoritosLivros,
  };
}