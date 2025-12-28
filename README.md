# Warli Backend - MongoDB Integration

This project has been updated to use MongoDB for storing products instead of local storage. All changes made in the admin panel are now stored in MongoDB and reflect across the entire website.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

You have two options:

#### Option A: MongoDB Atlas (Cloud - Recommended for Production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=3000
```

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/warli
PORT=3000
```

### 3. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 4. Access the Website

- Main website: `http://localhost:3000/index.html`
- Admin panel: `http://localhost:3000/admin.html`

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `DELETE /api/products` - Delete all custom products

## Features

- ✅ Products stored in MongoDB
- ✅ Admin panel creates/updates/deletes products via API
- ✅ All changes reflect immediately on the website
- ✅ Works across all devices and browsers
- ✅ Persistent data storage

## Deployment

For production deployment:

1. Set up MongoDB Atlas (cloud database)
2. Update `API_BASE_URL` in `admin.js` and `script.js` to use your production API URL
3. Deploy your backend server (e.g., Heroku, Railway, Render)
4. Update environment variables on your hosting platform

## Notes

- The default products (hardcoded in `script.js`) are not stored in MongoDB
- Only products created through the admin panel are stored in MongoDB
- Custom products are merged with default products on the frontend


