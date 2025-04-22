
import express from 'express';
const router= express.Router();
import {userController} from '../controllers/userController.js';
import { protect,admin } from '../middleware/auth.js';
import { validateUserInput } from '../utils/validation.js';

router.route('/')

                .get(protect,admin,userController.getUsers)
                .post(protect,admin,validateUserInput,userController.createUser);

router.route('/:id')
                    .get(protect,admin,userController.getUserById)
                    .put(protect,validateUserInput,userController.updateUser)
                    .delete(protect,admin,userController.deleteUser);

export default router;






