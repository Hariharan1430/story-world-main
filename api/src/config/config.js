import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
};