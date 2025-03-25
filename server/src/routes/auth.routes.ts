import express, { Router, RequestHandler } from 'express';
import { login, register } from '../controllers/auth.controller';

const router: Router = express.Router();

// Auth routes
router.post('/login', login as RequestHandler);
router.post('/register', register as RequestHandler);

export default router; 