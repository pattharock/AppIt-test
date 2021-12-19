import express from 'express';
import getWeather from '../controllers/weatherControllers.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/')
  .get(protect, getWeather);


export default router;