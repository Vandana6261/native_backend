import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Connect to Database
  await connectDB();

  // 2. Start HTTP Server
  app.listen(PORT, () => {
    console.log(`[Server] Backend Native Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`http://localhost:${PORT}`)
    console.log(`[Server] Health Endpoint: http://localhost:${PORT}/api/v1/health`);
  });
};

startServer();
