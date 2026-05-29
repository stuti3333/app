import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import { AssemblyAI } from 'assemblyai';

dotenv.config();

const app = express();
const __dirname = path.resolve();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const allowedOrigins = [
  'https://amazonclone-frontend-t7t9.onrender.com',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// AssemblyAI token endpoint
app.get('/api/assemblyai-token', async (req, res) => {
  try {
    const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
    const token = await client.realtime.createTemporaryToken({
      expires_in: 480,
    });
    res.json({ token });
  } catch (error) {
    console.error('AssemblyAI token error:', error);
    res.status(500).json({ message: 'Failed to generate AssemblyAI token' });
  }
});

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Serve static files from React build
const buildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(buildPath));

// Catch-all route for React Router - must be after API routes
app.use((req, res, next) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Serve index.html for all other routes (React Router)
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
