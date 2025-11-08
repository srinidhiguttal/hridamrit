import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();
    
    const CLIENT_ID = Deno.env.get("GOOGLE_FIT_CLIENT_ID");
    const CLIENT_SECRET = Deno.env.get("GOOGLE_FIT_CLIENT_SECRET");
    const REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/google-fit-callback`;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error("Google Fit credentials not configured");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange error:", error);
      throw new Error("Failed to exchange authorization code");
    }

    const tokens = await tokenResponse.json();

    return new Response(JSON.stringify(tokens), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Google Fit auth error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Authentication failed" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
