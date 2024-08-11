import { Router } from 'express';
import { imageController } from '../controllers/imageController';

const router = Router();

router.get('/images', imageController.processImage);

export default router;
