import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const backendUrl = Deno.env.get('BACKEND_URL')
        const backendApiKey = Deno.env.get('BACKEND_API_KEY')

        if (!backendUrl || !backendApiKey) {
            throw new Error('Backend configuration missing. Please set BACKEND_URL and BACKEND_API_KEY environment variables.')
        }

        console.log('Calling backend update_metrics endpoint...')

        // Call your backend from Supabase Edge Function
        const response = await fetch(`${backendUrl}/metrics/update_metrics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': backendApiKey,
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Backend call failed: ${response.status} ${response.statusText} - ${errorText}`)
        }

        console.log('Backend update_metrics call successful')

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Metrics updated successfully'
            }),
            {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )

    } catch (error) {
        console.error('Error in update-metrics function:', error)

        return new Response(
            JSON.stringify({
                error: error.message,
                success: false
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )
    }
})
