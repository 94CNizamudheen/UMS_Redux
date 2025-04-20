
import express, { json, urlencoded } from 'express';
import { static as serveStatic } from 'express';
import path, { join } from 'path';
import cors from 'cors';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename= fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);

dotenv.config()


const app=express();

connectDB();

app.use(cors());
app.use(json());
app.use(urlencoded({extended:false}));
app.use('/uploads',serveStatic(join(__dirname,'uploads')));

app.use('/api',routes);

app.use(errorHandler);
const PORT=process.env.PORT;
app.listen(PORT,()=>console.log(`Server Running on http://localhost:${PORT}`))

export default app;