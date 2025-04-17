import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import mongoose from "mongoose";

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://lawyerup-app.web.app",
  ], // Add your production domain
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json()); // This is needed to parse JSON body
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api", authRoutes);
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
