# Supabase Edge Function: update-metrics

This Edge Function securely calls your backend API to update metrics before fetching them from Supabase.

## 🔒 Security Benefits

- **API Key Protection**: Your backend API key is stored securely in Supabase Edge Function environment variables
- **Server-Side Execution**: The function runs on Supabase's infrastructure, not in the browser
- **No Client Exposure**: Sensitive credentials never reach the frontend

## 📁 Files

- `index.ts` - Main Edge Function code
- `deno.json` - Deno configuration
- `deploy-edge-function.sh` - Deployment script

## 🚀 Deployment

### Prerequisites
1. Install Supabase CLI: `npm install supabase`
2. Login: `supabase login`

### Deploy
```bash
./deploy-edge-function.sh
```

### Manual Deployment
```bash
supabase functions deploy update-metrics
```

## ⚙️ Configuration

Set these environment variables in Supabase Dashboard → Settings → Edge Functions:

- `BACKEND_URL`: Your backend API URL (e.g., `https://your-backend.com`)
- `BACKEND_API_KEY`: Your backend API key

## 🧪 Testing

Test the function:
```bash
supabase functions invoke update-metrics
```

Expected response:
```json
{
  "success": true,
  "message": "Metrics updated successfully"
}
```

## 🔄 How It Works

1. Frontend calls `fetchMetrics()` in `lib/supabase.ts`
2. Function invokes the `update-metrics` Edge Function
3. Edge Function calls your backend `/metrics/update_metrics` endpoint
4. Frontend fetches updated metrics from Supabase

## 🐛 Troubleshooting

### Function deployment fails
- Ensure you're logged in: `supabase login`
- Check your project is linked: `supabase status`

### Backend call fails
- Verify `BACKEND_URL` and `BACKEND_API_KEY` are set correctly
- Check backend endpoint is accessible
- Review Edge Function logs in Supabase Dashboard

### Environment variables not working
- Variables must be set in Supabase Dashboard, not local .env
- Redeploy function after changing environment variables
