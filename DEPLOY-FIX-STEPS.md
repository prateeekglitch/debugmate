# Streamify deploy fix – step by step (bhai)

Chat/Video "Connecting..." pe atak raha hai toh ye steps follow karo. Order matter karta hai.

---

## Step 1: Local check (pehle confirm karo sab theek hai)

Terminal open karo, backend folder mein jao:

```powershell
cd backend
npm run diagnose
```

**Agar sab ✅ dikhe** → Step 2 pe jao.

**Agar kuch ❌ dikhe** (jaise "STEAM_API_KEY is set" ❌):
- `backend/.env` open karo
- Stream dashboard se **API Key** aur **API Secret** copy karo
- `.env` mein ye lines honi chahiye (values apni daalna):
  ```
  STEAM_API_KEY=your_key_here
  STEAM_API_SECRET=your_secret_here
  ```
- Phir dubara `npm run diagnose` chalao, jab tak sab ✅ na ho.

---

## Step 2: Render pe backend env vars daalo

1. **Render.com** pe login karo → apna **backend** service kholo (jo API serve karta hai).
2. Left side se **Environment** pe click karo.
3. **Add Environment Variable** se ye **dono** add karo (values Stream dashboard se same jo local `.env` mein hain):

   | Key | Value |
   |-----|--------|
   | `STEAM_API_KEY` | (Stream ki API Key – number/letters wali) |
   | `STEAM_API_SECRET` | (Stream ki API Secret) |

4. **Save Changes** karo. Render automatically redeploy shuru karega – wait karo deploy complete ho.

**Note:** Agar `MONGO_URI`, `JWT_SECRET_KEY`, `NODE_ENV` pehle se add nahi hain toh unko bhi add karo (local `.env` se copy kar sakte ho).

---

## Step 3: Frontend build ke liye env var (Render pe)

Agar tumhara **frontend** bhi Render pe deploy hai (ya same service pe build ho raha hai):

1. Usi service ya **frontend** service ke **Environment** section mein jao.
2. Ek variable add karo:

   | Key | Value |
   |-----|--------|
   | `VITE_STREAM_API_KEY` | **Same value** jo `STEAM_API_KEY` mein dali (Step 2) |

3. Save karo. **Redeploy** karo (Manual Deploy ya Save se jo bhi trigger ho).

Ye zaroori hai kyunki production build ke time Vite isi se `VITE_STREAM_API_KEY` leta hai; nahi hoga toh chat/call connect nahi karega.

---

## Step 4: Deployed API test karo

Backend ka URL pata karo (jaise `https://streamify-xyz.onrender.com` – **slash** end mein mat lagana).

PowerShell mein:

```powershell
cd backend
$env:BASE_URL="https://YOUR-BACKEND-URL.onrender.com"; node scripts/diagnose.js
```

`YOUR-BACKEND-URL` apna actual URL se replace karo.

**Result ka matlab:**
- **401 Unauthorized** → Theek hai, server chal raha hai; browser mein login karke chat khologe toh token milega.
- **500** → Backend crash ho raha hai; Render ke **Logs** tab mein error dekho, usually `STEAM_API_KEY` / `STEAM_API_SECRET` galat ya missing honge – Step 2 dobara check karo.
- **504 / timeout** → Server so raha hai (free tier); pehle site browser mein open karke wake karo, phir dubara try karo.

---

## Step 5: Browser mein check karo

1. Apni **deployed site** open karo (jaise `https://debugmate.onrender.com`).
2. **Login** karo.
3. Kisi se **Chat** ya **Video call** open karo.

**Agar ab bhi "Connecting..." atak jaye:**
- **F12** → **Network** tab kholo.
- Chat/Call kholo, aur **chat/token** ya **token** wala request dhundho.
- Uspe click karke dekho:
  - **Status 200** + response mein `"token": "something"` → token aa raha hai, problem frontend/Stream connect mein ho sakti hai.
  - **Status 500** → backend token nahi bana pa raha; Render **Logs** dekho, Step 2 env vars check karo.
  - **Status 401** → session/cookie issue; logout karke dubara login karo.

---

## Short checklist (ek nazar mein)

- [ ] Step 1: `cd backend` → `npm run diagnose` → sab ✅
- [ ] Step 2: Render backend → Environment → `STEAM_API_KEY` + `STEAM_API_SECRET` add → Save → redeploy
- [ ] Step 3: Render frontend/build → Environment → `VITE_STREAM_API_KEY` = same as `STEAM_API_KEY` → Save → redeploy
- [ ] Step 4: `BASE_URL=... node scripts/diagnose.js` → 401 ya 200 (500/504 nahi)
- [ ] Step 5: Site pe login → Chat/Call open → connect ho jana chahiye

Iske baad bhi issue ho toh browser **Console** (F12 → Console) aur Render **Logs** ki screenshot bhej dena, exact error se fix bata denge.
