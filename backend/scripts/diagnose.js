/**
 * Streamify backend diagnostic – run from backend folder:
 *   npm run diagnose
 *   (or: node scripts/diagnose.js)
 *
 * To test your DEPLOYED API (e.g. Render):
 *   BASE_URL=https://your-backend.onrender.com node scripts/diagnose.js
 */

import "dotenv/config";
import { StreamChat } from "stream-chat";

const log = (msg, ok) => {
  const icon = ok === true ? "✅" : ok === false ? "❌" : "ℹ️";
  console.log(`${icon} ${msg}`);
};

const main = async () => {
  console.log("\n--- Streamify backend diagnostic ---\n");

  // 1) Env vars (backend uses STEAM_* – same as your .env)
  const apiKey = process.env.STEAM_API_KEY;
  const apiSecret = process.env.STEAM_API_SECRET;
  const hasKey = !!apiKey;
  const hasSecret = !!apiSecret;

  log("STEAM_API_KEY is set", hasKey);
  if (!hasKey) console.log("   → Fix: Set STEAM_API_KEY in .env (local) or Render env vars (deploy).");

  log("STEAM_API_SECRET is set", hasSecret);
  if (!hasSecret) console.log("   → Fix: Set STEAM_API_SECRET in .env (local) or Render env vars (deploy).");

  log("MONGO_URI is set", !!process.env.MONGO_URI);
  log("JWT_SECRET_KEY is set", !!process.env.JWT_SECRET_KEY);

  if (!hasKey || !hasSecret) {
    console.log("\n⚠️  Fix Stream env vars above, then run again.\n");
    process.exit(1);
  }

  // 2) Stream token generation
  let tokenOk = false;
  try {
    const client = StreamChat.getInstance(apiKey, apiSecret);
    const token = client.createToken("diagnostic-user-id");
    tokenOk = !!token && typeof token === "string";
    log("Stream token generation works", tokenOk);
    if (!tokenOk) console.log("   → Token was empty or not a string.");
  } catch (err) {
    log("Stream token generation works", false);
    console.log("   → Error:", err.message);
  }

  if (!tokenOk) {
    console.log("\n⚠️  Stream token failing. Check key/secret and try again.\n");
    process.exit(1);
  }

  console.log("\n--- Backend env + Stream token: OK ---\n");

  // 3) Optional: test deployed API
  const baseUrl = process.env.BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    console.log("To test deployed API run:");
    console.log("  BASE_URL=https://your-app.onrender.com node scripts/diagnose.js\n");
    return;
  }

  console.log(`Testing deployed API: ${baseUrl}\n`);

  try {
    const res = await fetch(`${baseUrl}/api/chat/token`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    const status = res.status;
    let body = "";
    try {
      body = await res.text();
    } catch (_) {}

    if (status === 401) {
      log("GET /api/chat/token → 401 Unauthorized", true);
      console.log("   → Server is up. You must be logged in (cookie) to get a token. This is expected when not logged in.");
    } else if (status === 200) {
      const data = body ? JSON.parse(body) : {};
      const hasToken = !!data?.token;
      log("GET /api/chat/token → 200 with token", hasToken);
      if (!hasToken) console.log("   → Response had no token. Check server logs for Stream errors.");
    } else if (status === 500) {
      log("GET /api/chat/token → 500 Server Error", false);
      console.log("   → Backend crashed generating token. Check Render logs and STEAM_* env vars.");
    } else if (status === 504 || res.type === "error") {
      log("GET /api/chat/token → timeout or 504", false);
      console.log("   → Server may be sleeping (Render free tier) or overloaded. Try again or check Render dashboard.");
    } else {
      log(`GET /api/chat/token → ${status}`, false);
      console.log("   → Body:", body.slice(0, 200));
    }
  } catch (err) {
    log("Deployed API request failed", false);
    console.log("   →", err.message);
    console.log("   → Check BASE_URL (e.g. https://your-app.onrender.com, no trailing slash).");
  }

  console.log("");
};

main();
