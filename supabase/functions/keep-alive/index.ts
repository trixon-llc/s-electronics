// supabase/functions/keep-alive/index.ts
// Lightweight Edge Function to prevent Supabase free-tier project pausing.
// Performs a trivial DB read to register activity.
// Deploy via: supabase functions deploy keep-alive

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Simple read query — just enough to count as "activity"
        const { count, error } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error("Keep-alive query error:", error.message);
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: error.message,
                    timestamp: new Date().toISOString(),
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        console.log(`Keep-alive ping OK — ${count} users, ${new Date().toISOString()}`);

        return new Response(
            JSON.stringify({
                status: "alive",
                users: count,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        console.error("Keep-alive error:", err);
        return new Response(
            JSON.stringify({
                status: "error",
                message: String(err),
                timestamp: new Date().toISOString(),
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
