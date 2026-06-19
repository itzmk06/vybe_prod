require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/database.js");

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    "We received too many requests from this IP, please try again later!",
});

app.use(helmet());
app.use(limiter);
app.use(express.json());

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://vybe-prod.vercel.app",
  "https://vybe-react.vercel.app",
  "https://vybe-frontend.onrender.com",
  process.env.FRONTEND_URL,
];

if (
  process.env.FRONTEND_URL &&
  !allowedOrigins.includes(process.env.FRONTEND_URL)
) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS BLOCKED origin:", origin);
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.options("*", cors());

app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const { authRouter } = require("./routes/authRoutes");
app.use("/", authRouter);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Connection to MongoDB failed: ${err}`);
  });
