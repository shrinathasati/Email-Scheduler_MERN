import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import sequenceRouter from "./routes/sequence.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "https://email-schedular-frontend.vercel.app", // Make sure the URL is without the trailing slash
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/sequence", sequenceRouter);

// Set up trust proxy for secure cookies
app.set("trust proxy", 1);

// Serve static files from frontend build
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Fallback route for React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

export { app };

