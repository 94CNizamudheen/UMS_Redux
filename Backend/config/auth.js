

import dotenv from 'dotenv';
dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiration = '24h';
export const saltRounds = 10;