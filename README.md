# QuickBooks OAuth Proxy for Google Apps Script

Use this small Node.js server as your OAuth Redirect URI in the Intuit Developer Portal.
It forwards the `code` (and all other params) to your Google Apps Script `/usercallback` endpoint.

## Environment variables
- `GAS_CALLBACK_URL` (required): Your exact Apps Script `/usercallback` URL.
- `QBO_STATE_SECRET` (optional): Shared secret to verify `state`.

## Run locally
```bash
npm install
npm start
# Visit http://localhost:3000/
```

## Deploy
Deploy to Render/Vercel/Railway and set the environment variables there. Use the `/callback` route as your Intuit Redirect URI.
