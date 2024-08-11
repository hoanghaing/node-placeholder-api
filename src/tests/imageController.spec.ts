import request from 'supertest';
import app from '../../src/app';
import { imageController } from '../../src//controllers/imageController';
import path from 'path';
import fs from 'fs';

describe('Image API Tests', () => {
  // Test the API endpoint
  it('should return a 200 status and resized image for valid inputs', async (done) => {
    const response = await request(app).get('/api/images?filename=argentina&width=200&height=200');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/image\/jpeg/);
    done();
  });

  it('should return a 404 status for a non-existent image', async (done) => {
    const response = await request(app).get('/api/images?filename=nonexistent&width=200&height=200');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Image not found');
    done();
  });

  it('should return a 400 status for missing width and height', async (done) => {
    const response = await request(app).get('/api/images?filename=argentina');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Both width and height are required');
    done();
  });

  it('should return a 400 status for invalid width and height', async (done) => {
    const response = await request(app).get('/api/images?filename=argentina&width=-100&height=200');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid width or height. Both must be positive integers');
    done();
  });

  // Test image processing function directly
  describe('Image Processing Tests', () => {
    it('should resize and save an image correctly', async () => {
      const filename = 'argentina';
      const width = 300;
      const height = 300;
      const originalImagePath = path.resolve('uploads', `${filename}.jpg`);
      const resizedImagePath = path.resolve('uploads', `resized-${width}x${height}-${filename}.jpg`);

      // Ensure resized image does not exist before test
      if (fs.existsSync(resizedImagePath)) {
        fs.unlinkSync(resizedImagePath);
      }

      await imageController.processImage({
        query: { filename, width: width.toString(), height: height.toString() }
      } as any, {
        sendFile: (filePath: string) => {
          expect(filePath).toBe(resizedImagePath);
          expect(fs.existsSync(resizedImagePath)).toBe(true);
        },
        status: () => ({
          json: () => { }
        })
      } as any);

      // Clean up after test
      fs.unlinkSync(resizedImagePath);
    });

    it('should return an error when image processing fails', async () => {
      const filename = 'nonexistent';
      const width = 200;
      const height = 200;

      await imageController.processImage({
        query: { filename, width: width.toString(), height: height.toString() }
      } as any, {
        status: (code: number) => {
          expect(code).toBe(404);
          return {
            json: (body: any) => {
              expect(body.error).toBe('Image not found');
            }
          };
        },
        sendFile: () => { }
      } as any);
    });
  });
});
