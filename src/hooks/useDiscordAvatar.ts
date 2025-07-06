import { useState, useEffect } from 'react';

interface DiscordAvatarData {
  avatarUrl: string;
  username: string;
  discriminator: string;
}

export const useDiscordAvatar = (userId: string | null) => {
  const [avatarData, setAvatarData] = useState<DiscordAvatarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setAvatarData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchDiscordAvatar = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching Discord avatar for user:', userId);
        
        // Check if we have Supabase configuration
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        // If Supabase is not configured, use fallback immediately
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url_here') {
          console.log('Supabase not configured, using fallback avatar');
          const fallbackData = generateFallbackAvatar(userId);
          setAvatarData(fallbackData);
          setLoading(false);
          return;
        }

        // Try to fetch from Supabase function
        const apiUrl = `${supabaseUrl}/functions/v1/discord-avatar?userId=${encodeURIComponent(userId)}`;
        
        const headers = {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        };

        console.log('Making request to Discord avatar function...');
        
        // Set a timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        try {
          const response = await fetch(apiUrl, { 
            headers,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format');
          }

          const data = await response.json();
          console.log('Successfully fetched avatar data:', data);
          setAvatarData(data);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }

      } catch (err) {
        console.warn('Discord avatar fetch failed, using fallback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Always provide a fallback avatar
        const fallbackData = generateFallbackAvatar(userId);
        setAvatarData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    // Generate a consistent fallback avatar
    const generateFallbackAvatar = (userId: string): DiscordAvatarData => {
      const defaultAvatarIndex = parseInt(userId) % 5;
      const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
      
      return {
        avatarUrl: defaultAvatarUrl,
        username: 'LORDX679',
        discriminator: '0000',
      };
    };

    fetchDiscordAvatar();
  }, [userId]);

  return { avatarData, loading, error };
};