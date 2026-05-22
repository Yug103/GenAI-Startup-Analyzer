import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes imports
import authRoutes from './routes/authRoutes.js';
import startupRoutes from './routes/startupRoutes.js';
import competitorRoutes from './routes/competitorRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import validationRoutes from './routes/validationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import exportRoutes from './routes/exportRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/startup', startupRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);

app.get('/', (req, res) => {
  res.send('GenAI Startup Analyzer API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

import { initializeRagEngine } from './rag/researchEngine.js';

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  await initializeRagEngine();
});
