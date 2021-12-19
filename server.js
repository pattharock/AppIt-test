import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import weatherRoutes from './routes/weatherRoutes.js';
import userRoutes from './routes/userRoutes.js';
import {notFound, errorHandler} from './middleware/errorMiddleware.js';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// establish database connection
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200);
  res.json({
    "message": "API running"
  });
});


app.use('/api/weather', weatherRoutes);
app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${port}`);
})

