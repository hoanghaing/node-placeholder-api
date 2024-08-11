import { Request, Response } from 'express';
import sharp from 'sharp';

export const placeholderController = {
  generatePlaceholder: async (req: Request, res: Response) => {
    const { width, height } = req.params;

    const imgWidth = parseInt(width, 10) || 100;
    const imgHeight = parseInt(height, 10) || 100;

    const placeholder = await sharp({
      create: {
        width: imgWidth,
        height: imgHeight,
        channels: 3,
        background: { r: 200, g: 200, b: 200 },
      },
    }).png().toBuffer();

    res.type('image/png').send(placeholder);
  },
};
