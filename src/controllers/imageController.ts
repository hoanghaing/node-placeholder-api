import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const imageController = {
  processImage: async (req: Request, res: Response) => {
    const { filename, width, height } = req.query;

    // Check for missing parameters
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    if (!width || !height) {
      return res.status(400).json({ error: 'Both width and height are required' });
    }

    const imgWidth = parseInt(width as string, 10);
    const imgHeight = parseInt(height as string, 10);

    // Validate width and height
    if (isNaN(imgWidth) || isNaN(imgHeight) || imgWidth <= 0 || imgHeight <= 0) {
      return res.status(400).json({ error: 'Invalid width or height. Both must be positive integers' });
    }

    // Validate filename
    if (typeof filename !== 'string' || !filename.match(/^[a-zA-Z0-9_-]+$/)) {
      return res.status(400).json({ error: 'Invalid filename. Only alphanumeric characters, dashes, and underscores are allowed' });
    }

    const originalImagePath = path.resolve('assets/full', `${filename}.jpg`);
    const resizedImagePath = path.resolve('assets/thumb', `${filename}-thumb-${imgWidth}x${imgHeight}.jpg`);

    // Check if the requested image exists
    if (!fs.existsSync(originalImagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Check if resized image already exists
    if (fs.existsSync(resizedImagePath)) {
      return res.sendFile(resizedImagePath);
    }

    try {
      // Resize and save the image
      await sharp(originalImagePath)
        .resize(imgWidth, imgHeight)
        .toFile(resizedImagePath);

      // Serve the resized image
      return res.sendFile(resizedImagePath);
    } catch (error) {
      return res.status(500).json({ error: 'Error processing image' });
    }
  },
};
