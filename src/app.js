import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Backend Native API Server',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Mounting domain routes
app.use('/api', routes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
