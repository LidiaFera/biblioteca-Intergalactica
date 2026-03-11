import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook personalizado para buscar os IDs dos livros que o usuário já leu.
 * @param {Object} user - Objeto do usuário autenticado (ou null).
 * @param {Array} livros - Lista de livros (opcional, usado como gatilho para recarregar).
 * @returns {Object} { leiturasIds (Set), loading, error }
 */
export default function useLeituras(user, livros = []) {
  const [leiturasIds, setLeiturasIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLeiturasIds(new Set());
      return;
    }

    const fetchLeituras = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('leituras')
          .select('livro_id')
          .eq('user_id', user.id);

        if (error) throw error;
        setLeiturasIds(new Set(data.map(item => item.livro_id)));
      } catch (err) {
        console.error('Erro ao buscar leituras:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeituras();
  }, [user, livros]); // Recarrega se o usuário ou a lista de livros mudar

  return { leiturasIds, loading, error };
}