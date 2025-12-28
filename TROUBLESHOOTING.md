# Troubleshooting Guide

## Common Errors and Solutions

### Error: "Failed to load resource: the server responded with a status of 500"

**Cause:** The server is running but MongoDB is not connected.

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   # For local MongoDB
   mongod --version
   ```

2. Check your `.env` file exists and has the correct connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/warli
   ```

3. For MongoDB Atlas, make sure your connection string is correct:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/warli
   ```

4. Restart your server after updating `.env`:
   ```bash
   npm start
   ```

### Error: "Failed to load resource: the server responded with a status of 400"

**Cause:** Invalid data being sent to the API (missing fields, invalid price, etc.)

**Solutions:**
1. Make sure all required fields are filled:
   - Product Name
   - Description
   - Price (must be a number)
   - Image URL

2. Check the browser console for detailed error messages

3. Verify the image URL is valid and accessible

### Error: "Database not connected"

**Cause:** MongoDB connection hasn't been established yet.

**Solutions:**
1. Wait a few seconds after starting the server for MongoDB to connect

2. Check server logs for connection errors:
   ```bash
   npm start
   # Look for: ✅ Connected to MongoDB
   ```

3. Test the connection:
   - Visit: `http://localhost:3000/api/health`
   - Check if `database.connected` is `true`

### Server Won't Start

**Solutions:**
1. Make sure Node.js is installed:
   ```bash
   node --version
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Check if port 3000 is already in use:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```

4. Change the port in `.env` if needed:
   ```env
   PORT=3001
   ```

## Testing Your Setup

1. **Test Server:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return JSON with database status.

2. **Test MongoDB Connection:**
   ```bash
   # If using local MongoDB
   mongosh
   use warli
   db.products.find()
   ```

3. **Test API Endpoints:**
   - GET all products: `http://localhost:3000/api/products`
   - Health check: `http://localhost:3000/api/health`

## Quick Fix Checklist

- [ ] Server is running (`npm start`)
- [ ] `.env` file exists with `MONGODB_URI`
- [ ] MongoDB is running (local) or Atlas connection string is correct
- [ ] Dependencies installed (`npm install`)
- [ ] Port 3000 is available
- [ ] Browser console shows no CORS errors
- [ ] API health endpoint returns `database.connected: true`

## Getting Help

If you're still having issues:

1. Check server console for error messages
2. Check browser console (F12) for detailed errors
3. Visit `/api/health` to see connection status
4. Verify MongoDB connection string format

