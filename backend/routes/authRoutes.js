import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup); // Signup route
router.post('/login', login);   // Login route

export default router;
