# Quick Fix: Products Not Showing on Live Website

## The Problem
Products are saved to MongoDB but only show on localhost, not on the live website.

## The Solution
You need to tell your frontend where your backend API is located.

## Step-by-Step Fix

### 1. Find Your Backend URL

Where did you deploy your backend server?
- **Railway:** `https://your-app-name.railway.app`
- **Render:** `https://your-app-name.onrender.com`
- **Heroku:** `https://your-app-name.herokuapp.com`
- **Other:** Your backend server URL

### 2. Update config.js

Open `config.js` and change this line:

```javascript
// BEFORE (current):
production: '/api',

// AFTER (replace with your backend URL):
production: 'https://your-backend-url.com/api',
```

**Example:**
```javascript
production: 'https://warli-backend.railway.app/api',
```

### 3. Redeploy Your Frontend

After updating `config.js`, commit and push the changes, then redeploy your frontend.

### 4. Test

1. Open your live website
2. Open browser console (F12)
3. Check for any errors
4. Products should now load from your backend

## Still Not Working?

### Check 1: Is your backend running?
Visit: `https://your-backend-url.com/api/health`

You should see JSON with `"status": "ok"`

### Check 2: Can you access products?
Visit: `https://your-backend-url.com/api/products`

You should see a JSON array of products.

### Check 3: Browser console errors?
- CORS errors? → Backend needs CORS enabled (already done)
- 404 errors? → Check the URL in config.js
- Network errors? → Backend might be down

## Need to Deploy Backend?

If you haven't deployed your backend yet, see `DEPLOYMENT.md` for detailed instructions.

Quick options:
1. **Railway** (easiest): railway.app → New Project → Connect Repo → Add MONGODB_URI → Deploy
2. **Render**: render.com → New Web Service → Connect Repo → Add MONGODB_URI → Deploy

## Example: Complete Setup

**Backend on Railway:**
- URL: `https://warli-api.railway.app`
- config.js: `production: 'https://warli-api.railway.app/api'`

**Frontend on Vercel:**
- URL: `https://warli-website.vercel.app`
- Uses config.js to call backend API

That's it! Your frontend will now fetch products from your deployed backend.

