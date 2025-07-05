import { useState, useEffect } from 'react';

interface DiscordAvatarData {
  avatarUrl: string;
  username: string;
  discriminator: string;
}

export const useDiscordAvatar = (userId: string | null) => {
  const [avatarData, setAvatarData] = useState<DiscordAvatarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchDiscordAvatar = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase not configured. Please connect to Supabase first.');
        }

        const apiUrl = `${supabaseUrl}/functions/v1/discord-avatar?userId=${userId}`;
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response. Please check Supabase function configuration.');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch Discord avatar');
        }

        const data = await response.json();
        setAvatarData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching Discord avatar:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordAvatar();
  }, [userId]);

  return { avatarData, loading, error };
};