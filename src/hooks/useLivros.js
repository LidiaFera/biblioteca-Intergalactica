import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook personalizado para buscar todos os livros da tabela 'livros'.
 * @returns {Object} { livros, loading, error }
 */
export default function useLivros() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('livros')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLivros(data || []);
      } catch (err) {
        console.error('Erro ao buscar livros:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  return { livros, loading, error };
}