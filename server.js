/**
 * QuickBooks OAuth Proxy for Google Apps Script
 * -------------------------------------------------
 * Use this proxy URL as your Redirect URI in Intuit.
 * It forwards all query parameters (code, state, realmId, etc.)
 * to your Apps Script /usercallback endpoint.
 */

const express = require("express");
const app = express();

// REQUIRED: Set this as an environment variable on Render
const GAS_CALLBACK_URL = process.env.GAS_CALLBACK_URL;

// OPTIONAL: If you want to enforce a shared secret, set QBO_STATE_SECRET on Render
const QBO_STATE_SECRET = process.env.QBO_STATE_SECRET || null;

app.get("/", (req, res) => {
  res.send("✅ QBO OAuth Proxy is running. Use /callback as your Redirect URI in Intuit.");
});

app.get("/callback", (req, res) => {
  try {
    if (!GAS_CALLBACK_URL) {
      return res.status(500).send("❌ GAS_CALLBACK_URL is not set on the server.");
    }

    const params = new URLSearchParams(req.query);

    // Optional: enforce state secret if provided
    if (QBO_STATE_SECRET) {
      const incomingState = params.get("state") || "";
      if (incomingState !== QBO_STATE_SECRET) {
        return res.status(403).send("❌ Invalid state.");
      }
    }

    // Require the authorization code
    const code = params.get("code");
    if (!code) {
      return res.status(400).send("❌ No authorization code received from QuickBooks.");
    }

    // Forward ALL original params to GAS (code, state, realmId, etc.)
    const forwardUrl = GAS_CALLBACK_URL + "?" + params.toString();
    console.log("🔄 Forwarding to GAS:", forwardUrl);
    res.redirect(forwardUrl);
  } catch (e) {
    console.error("Proxy error:", e);
    res.status(500).send("❌ Proxy error: " + e.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});
