
# Calendar Application

A full-stack calendar application built with React, Express.js, and MongoDB. This application allows users to create, view, update, and delete events on an interactive calendar interface.

## Features

- Interactive calendar with Day, Week, and Month views
- Create, view, and delete events
- Categorize events with color-coding
- Filter events by category
- Responsive design for various screen sizes

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- React Query for state management and data fetching
- React Router for navigation
- Axios for API requests
- date-fns for date manipulation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Setup

1. Clone the repository:
```
git clone <repository-url>
cd calendar-app
```

2. Create a `.env` file based on the `.env.example` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/calendar_app
VITE_API_URL=/api
```

3. Install dependencies:
```
npm install
```

4. Start the development server:
```
npm run dev
```

This will start both the backend server and the frontend development server concurrently. The app will be available at http://localhost:8080.

## Deployment on Render

This project is configured for easy deployment on Render.

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Build Command:** `npm install && npm run render-postbuild`
   - **Start Command:** `npm run render-start`
   - **Environment Variables:**
     - `PORT`: 10000 (Render default)
     - `MONGODB_URI`: Your MongoDB connection string
     - `NODE_ENV`: production

4. Click "Create Web Service"

Render will automatically build and deploy your application. The frontend will be served from the Express server.

## API Endpoints

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an existing event
- `DELETE /api/events/:id` - Delete an event

## Project Structure

```
├── backend/               # Backend code
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── server.js          # Express server setup
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   └── lib/               # Utility functions
├── .env                   # Environment variables (create from .env.example)
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

## License

This project is open source and available under the [MIT License](LICENSE).
