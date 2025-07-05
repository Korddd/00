const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Discord User ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Fetch user data from Discord API
    const discordResponse = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        'Authorization': `Bot ${Deno.env.get('DISCORD_BOT_TOKEN')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!discordResponse.ok) {
      // If bot token fails, try public endpoint (limited info)
      const publicResponse = await fetch(`https://discord.com/api/v10/users/${userId}`);
      
      if (!publicResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch Discord user data' }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      const userData: DiscordUser = await publicResponse.json();
      
      // Generate avatar URL
      const avatarUrl = userData.avatar 
        ? `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.png?size=256`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator) % 5}.png`;

      return new Response(
        JSON.stringify({
          avatarUrl,
          username: userData.username,
          discriminator: userData.discriminator,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const userData: DiscordUser = await discordResponse.json();
    
    // Generate avatar URL
    const avatarUrl = userData.avatar 
      ? `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator) % 5}.png`;

    return new Response(
      JSON.stringify({
        avatarUrl,
        username: userData.username,
        discriminator: userData.discriminator,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error fetching Discord avatar:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});