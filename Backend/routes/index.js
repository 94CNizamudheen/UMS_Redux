import express from 'express';
const router= express.Router();
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'

router.use('/auth',authRoutes)
router.use('/users',userRoutes)

export default router