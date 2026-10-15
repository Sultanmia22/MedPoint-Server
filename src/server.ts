import 'dotenv/config';
import cors from "cors";
import cookieParser from "cookie-parser"; 
import express, { type Express, type Request, type Response } from 'express';
import router from './routes/index.ts';


const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
// CORS config
app.use(cors({
  origin: "http://localhost:3000",   
  credentials: true,                
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});