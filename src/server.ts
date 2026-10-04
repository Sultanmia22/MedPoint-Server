import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import router from './routes/index.ts';


const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});