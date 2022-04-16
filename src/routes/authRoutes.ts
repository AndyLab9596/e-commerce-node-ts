import { Router } from "express";
import { register, login, logout } from '../controllers/authController';

const router = Router();
router.post('/register', register).post('/login', login).post('/logout', logout);

export default router;