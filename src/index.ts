import express from 'express';
import imageRoute from './routes/imageRoute';

const app = express();
const port = process.env.PORT || 3000;

app.use('/api', imageRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
