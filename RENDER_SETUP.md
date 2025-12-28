# Render Deployment Setup

## Quick Fix for Current Error

The error occurs because Render is trying to run `admin.js` instead of `server.js`. 

## Solution

### Option 1: Update Render Settings (Recommended)

1. Go to your Render dashboard
2. Select your service
3. Go to **Settings** → **Build & Deploy**
4. Update **Start Command** to:
   ```
   npm start
   ```
   or
   ```
   node server.js
   ```

### Option 2: Use render.yaml (Already Created)

The `render.yaml` file has been created. If Render supports it, it will automatically use the correct start command.

## Environment Variables

Make sure you have set these in Render:

1. Go to **Environment** tab
2. Add these variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `NODE_ENV` - Set to `production` (optional)

## After Fixing

1. Save the settings in Render
2. Trigger a new deployment (or push a commit)
3. Check the logs - you should see:
   ```
   ✅ Connected to MongoDB
   🚀 Server running on http://localhost:PORT
   ```

## Verify Deployment

Once deployed, test your API:
- Health: `https://your-app.onrender.com/api/health`
- Products: `https://your-app.onrender.com/api/products`

## Update Frontend Config

After your backend is deployed, update `config.js`:

```javascript
production: 'https://your-app.onrender.com/api',
```

Then redeploy your frontend.

