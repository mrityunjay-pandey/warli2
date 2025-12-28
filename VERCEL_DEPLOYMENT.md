# Vercel Frontend + Render Backend Setup

## Current Setup

- **Frontend:** warli.co (Vercel)
- **Backend:** warli2.onrender.com (Render)
- **API URL:** https://warli2.onrender.com/api

## What Was Fixed

Updated `config.js` to point to your Render backend:

```javascript
production: 'https://warli2.onrender.com/api',
```

## Next Steps

1. **Commit and push the updated `config.js`** to your repository
2. **Redeploy on Vercel** - Vercel will automatically redeploy when you push, or you can manually trigger a redeploy
3. **Test on warli.co** - Products should now load from the Render backend

## Verify It's Working

1. Open warli.co in your browser
2. Open browser console (F12)
3. Check Network tab - you should see requests to `https://warli2.onrender.com/api/products`
4. Products should appear on the page

## Troubleshooting

### Products still not showing?

1. **Check browser console for errors:**
   - CORS errors? → Backend CORS is already configured
   - 404 errors? → Check the API URL in config.js
   - Network errors? → Check if Render backend is running

2. **Test backend directly:**
   - Visit: https://warli2.onrender.com/api/health
   - Should return: `{"status":"ok",...}`
   - Visit: https://warli2.onrender.com/api/products
   - Should return array of products

3. **Check Vercel deployment:**
   - Make sure the latest commit with updated config.js is deployed
   - Check Vercel build logs for any errors

4. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

## CORS Configuration

The backend already has CORS enabled with `app.use(cors())` which allows all origins. This should work fine for your setup.

If you want to restrict CORS to only warli.co for security, you can update server.js:

```javascript
app.use(cors({
    origin: ['https://warli.co', 'https://www.warli.co', 'http://localhost:3000']
}));
```

But the current setup should work as-is.

