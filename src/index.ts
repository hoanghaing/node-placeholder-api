import express, { Request, Response } from 'express';
import exampleRoute from './routes/exampleRoute';

const app = express();
const port = process.env.PORT || 3000;

app.use('/api/example', exampleRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
