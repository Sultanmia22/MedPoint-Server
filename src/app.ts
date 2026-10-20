import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { type Request, type Response } from "express";
import router from "./routes/index.ts";

const app = express();
const configuredOrigins = process.env.CORS_ORIGINS;

if (process.env.NODE_ENV === "production" && !configuredOrigins) {
  throw new Error("CORS_ORIGINS must be configured in production.");
}

const allowedOrigins = (configuredOrigins ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (_req: Request, res: Response) => {
  res.send("MedPoint API is running.");
});

app.use("/api/v1", router);

export default app;
