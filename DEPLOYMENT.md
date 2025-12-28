# Deployment Guide

## Quick Fix for Live Website

If your products are showing on localhost but not on the live website, you need to update the API URL in `config.js`.

### Step 1: Update config.js

Open `config.js` and update the `production` URL:

```javascript
production: 'https://your-backend-url.com/api', // Replace with your actual backend URL
```

### Step 2: Deploy Your Backend Server

You need to deploy your Node.js backend server. Here are popular options:

#### Option A: Railway (Recommended - Easy Setup)
1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `PORT` - Railway will set this automatically
5. Deploy
6. Copy your Railway app URL (e.g., `https://warli-backend.railway.app`)
7. Update `config.js`:
   ```javascript
   production: 'https://warli-backend.railway.app/api'
   ```

#### Option B: Render
1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`
7. Deploy and copy the URL
8. Update `config.js` with the Render URL

#### Option C: Heroku
1. Install Heroku CLI
2. Run:
   ```bash
   heroku create your-app-name
   heroku config:set MONGODB_URI=your_mongodb_uri
   git push heroku main
   ```
3. Update `config.js` with your Heroku URL

#### Option D: Vercel (Serverless Functions)
If deploying frontend and backend together on Vercel, you'll need to create API routes. See Vercel serverless setup below.

### Step 3: Update Frontend Deployment

After updating `config.js` with your backend URL, redeploy your frontend.

## Deployment Scenarios

### Scenario 1: Backend on Separate Domain (Recommended)

**Backend:** `https://warli-api.railway.app`  
**Frontend:** `https://warli-website.vercel.app`

**config.js:**
```javascript
production: 'https://warli-api.railway.app/api'
```

### Scenario 2: Same Domain (Vercel Serverless)

If both frontend and backend are on Vercel:

1. Create `api/products.js` in your project root:
   ```javascript
   // This would require converting to serverless functions
   // Or use Vercel's API routes feature
   ```

2. **config.js:**
   ```javascript
   production: '/api' // Same domain, relative path
   ```

### Scenario 3: Backend on Subdomain

**Backend:** `https://api.yourdomain.com`  
**Frontend:** `https://yourdomain.com`

**config.js:**
```javascript
production: 'https://api.yourdomain.com/api'
```

## Environment Variables for Backend

When deploying your backend, make sure to set these environment variables:

- `MONGODB_URI` - Your MongoDB Atlas connection string
- `PORT` - Usually set automatically by hosting platform

## Testing After Deployment

1. Check backend health: `https://your-backend-url.com/api/health`
2. Test API: `https://your-backend-url.com/api/products`
3. Check browser console for API errors
4. Verify CORS is enabled (should be with `cors()` middleware)

## Troubleshooting

### Products not showing on live site

1. **Check API URL in config.js** - Make sure it points to your deployed backend
2. **Check browser console** - Look for CORS or network errors
3. **Test backend directly** - Visit `https://your-backend-url.com/api/products` in browser
4. **Check MongoDB connection** - Backend logs should show "✅ Connected to MongoDB"

### CORS Errors

If you see CORS errors, make sure:
- Backend has `app.use(cors())` enabled (already in server.js)
- Backend is actually running and accessible

### 404 Errors on API Calls

- Verify the backend URL in `config.js` is correct
- Make sure backend routes are at `/api/products` (already configured)
- Check that backend server is running

## Quick Checklist

- [ ] Backend server deployed and running
- [ ] MongoDB connection string configured on backend
- [ ] `config.js` updated with production backend URL
- [ ] Frontend redeployed with updated config
- [ ] Tested API endpoint directly in browser
- [ ] Checked browser console for errors
- [ ] Verified products appear on live site

