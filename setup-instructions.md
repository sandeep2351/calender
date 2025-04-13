
# How to Set Up the Combined Frontend and Backend

## Local Development

1. Create a `.env` file in the root directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/calendar_app
VITE_API_URL=/api
```

2. Install required dependencies:
```
npm install
cd backend
npm install
```

3. Start the development server:
```
npm run dev
```

This will run both the backend and frontend concurrently.

## Deployment on Render

1. Rename `render-package.json` to `package.json` before deployment.
2. Create a new Web Service on Render.
3. Configure the following settings:
   - **Build Command:** `npm install && npm run render-postbuild`
   - **Start Command:** `npm run render-start`
   - **Environment Variables:**
     - `PORT`: 10000 (Render default)
     - `MONGODB_URI`: Your MongoDB connection string
     - `NODE_ENV`: production

Render will automatically build and deploy your application with both frontend and backend running on the same server.
