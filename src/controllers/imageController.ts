import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const imageController = {
  processImage: async (req: Request, res: Response) => {
    const { filename, width, height } = req.query;

    // Convert parameters to appropriate types
    const imgWidth = parseInt(width as string, 10) || null;
    const imgHeight = parseInt(height as string, 10) || null;

    if (filename) {
      const filePath = path.resolve('assets/full', `${filename}.jpg`);

      // Check if the requested image exists
      if (fs.existsSync(filePath)) {
        const resizedImagePath = path.resolve('assets/thumb', `${filename}-thumb-${imgWidth}x${imgHeight}-.jpg`);

        // Check if resized image already exists
        if (fs.existsSync(resizedImagePath)) {
          return res.sendFile(resizedImagePath);
        }

        try {
          // Resize and serve the image
          const resizedImage = await sharp(filePath)
            .resize(imgWidth, imgHeight)
            .toFile(resizedImagePath);

          return res.sendFile(resizedImagePath);
        } catch (error) {
          return res.status(500).json({ error: 'Error processing image' });
        }
      } else {
        return res.status(404).json({ error: 'Image not found' });
      }
    } else {
      // Generate a placeholder image if no filename is provided
      const placeholder = await sharp({
        create: {
          width: imgWidth || 100,
          height: imgHeight || 100,
          channels: 3,
          background: { r: 200, g: 200, b: 200 },
        },
      })
        .png()
        .toBuffer();

      return res.type('image/png').send(placeholder);
    }
  },
};
