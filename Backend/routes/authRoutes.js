

import express from 'express';
const router= express.Router();
import {authController} from '../controllers/authController.js'
import {validateLoginInput,validateRegisterInput} from '../utils/validation.js';
import {protect} from '../middleware/auth.js';

router.post('/register',validateRegisterInput,authController.register);
router.post('/login',validateLoginInput,authController.login);

router.get('/me',protect,authController.getCurrentUser);

export default router;