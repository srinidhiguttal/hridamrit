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
    const { accessToken } = await req.json();

    if (!accessToken) {
      throw new Error("Access token is required");
    }

    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Fetch height and weight from Google Fit
    const bodyResponse = await fetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.weight:com.google.android.gms:merge_weight/datasets/" +
      `${sevenDaysAgo * 1000000}-${now * 1000000}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const heightResponse = await fetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.height:com.google.android.gms:merge_height/datasets/" +
      `${sevenDaysAgo * 1000000}-${now * 1000000}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Fetch steps
    const stepsResponse = await fetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.step_count.delta:com.google.android.gms:estimated_steps/datasets/" +
      `${sevenDaysAgo * 1000000}-${now * 1000000}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Fetch calories
    const caloriesResponse = await fetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended/datasets/" +
      `${sevenDaysAgo * 1000000}-${now * 1000000}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const bodyData = await bodyResponse.json();
    const heightData = await heightResponse.json();
    const stepsData = await stepsResponse.json();
    const caloriesData = await caloriesResponse.json();

    // Extract latest values
    const weight = bodyData.point?.length > 0 
      ? bodyData.point[bodyData.point.length - 1].value[0].fpVal 
      : null;

    const height = heightData.point?.length > 0 
      ? heightData.point[heightData.point.length - 1].value[0].fpVal 
      : null;

    const totalSteps = stepsData.point?.reduce((sum: number, point: any) => 
      sum + (point.value[0]?.intVal || 0), 0) || 0;

    const totalCalories = caloriesData.point?.reduce((sum: number, point: any) => 
      sum + (point.value[0]?.fpVal || 0), 0) || 0;

    return new Response(
      JSON.stringify({
        weight: weight ? Math.round(weight) : null,
        height: height ? Math.round(height * 100) : null, // Convert to cm
        steps: totalSteps,
        calories: Math.round(totalCalories),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Google Fit data fetch error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to fetch data" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
