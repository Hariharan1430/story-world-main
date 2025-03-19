import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import storyRoutes from "./routes/storyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userRoleRoutes from "./routes/userRoleRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
// import swaggerUi from 'swagger-ui-express';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerDocument from './swagger/swagger.json' assert { type: 'json' };
import { limiter } from './middleware/rateLimit.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());

// Apply rate limiting
app.use(limiter);

// Swagger setup
// const options = {
//   swaggerDefinition: swaggerDocument,
//   apis: ['./src/routes/*.js'], // Path to the API docs
// };
// const specs = swaggerJsdoc(options);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api/stories", storyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/userRoles", userRoleRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection and server start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // return initializeGridFS();
  })
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during startup:", err);
    process.exit(1);
  });
