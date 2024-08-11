import { Request, Response } from 'express';

export const exampleController = {
  getExample: (req: Request, res: Response) => {
    res.send('Hello, world!');
  },
};
