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
    if (!userId) {
      setAvatarData(null);
      setError(null);
      return;
    }

    const fetchDiscordAvatar = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if we have Supabase configuration
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url_here') {
          // Fallback to generating default Discord avatar without API call
          const defaultAvatarIndex = parseInt(userId) % 5;
          const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
          
          setAvatarData({
            avatarUrl: defaultAvatarUrl,
            username: `User ${userId}`,
            discriminator: '0000',
          });
          return;
        }

        const apiUrl = `${supabaseUrl}/functions/v1/discord-avatar?userId=${encodeURIComponent(userId)}`;
        
        const headers = {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        };

        const response = await fetch(apiUrl, { headers });
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // If not JSON, fall back to default avatar generation
          const defaultAvatarIndex = parseInt(userId) % 5;
          const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
          
          setAvatarData({
            avatarUrl: defaultAvatarUrl,
            username: `User ${userId}`,
            discriminator: '0000',
          });
          return;
        }

        if (!response.ok) {
          // If response is not ok but is JSON, try to parse error
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          } catch {
            // If parsing fails, fall back to default avatar
            const defaultAvatarIndex = parseInt(userId) % 5;
            const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
            
            setAvatarData({
              avatarUrl: defaultAvatarUrl,
              username: `User ${userId}`,
              discriminator: '0000',
            });
            return;
          }
        }

        const data = await response.json();
        setAvatarData(data);
      } catch (err) {
        console.warn('Discord avatar fetch failed, using fallback:', err);
        
        // Always provide a fallback avatar instead of showing an error
        const defaultAvatarIndex = parseInt(userId) % 5;
        const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
        
        setAvatarData({
          avatarUrl: defaultAvatarUrl,
          username: `User ${userId}`,
          discriminator: '0000',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordAvatar();
  }, [userId]);

  return { avatarData, loading, error };
};