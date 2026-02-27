import { Router } from 'express';
import { generateMaterial } from '../controllers/material.controller';
import { optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', optionalAuthenticate, generateMaterial);

export default router;
