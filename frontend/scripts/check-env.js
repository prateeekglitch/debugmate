/**
 * Quick check that build-time env is set for Stream.
 * Run from repo root:  node frontend/scripts/check-env.js
 * Or from frontend:   node scripts/check-env.js
 *
 * For production build you must set VITE_STREAM_API_KEY in the environment
 * where you run `npm run build` (e.g. Render build env).
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, "..", ".env");
const key = "VITE_STREAM_API_KEY";

console.log("\n--- Frontend Stream env check ---\n");

// Check .env file (local dev)
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  const match = content.match(new RegExp(`^${key}=(.+)$`, "m"));
  const value = match ? match[1].trim() : "";
  if (value) {
    console.log("✅ .env has VITE_STREAM_API_KEY (good for local dev)");
  } else {
    console.log("❌ .env exists but VITE_STREAM_API_KEY is missing or empty");
    console.log("   Add: VITE_STREAM_API_KEY=your_stream_key\n");
    process.exit(1);
  }
} else {
  console.log("ℹ️  No .env in frontend (ok if you set env in Render/build)");
}

console.log("\nFor DEPLOYED frontend (e.g. Render):");
console.log("  In your build environment set: VITE_STREAM_API_KEY=<same key as backend STEAM_API_KEY>");
console.log("  Then redeploy.\n");
