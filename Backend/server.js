
import express, { json, urlencoded } from 'express';
import serveStatic from 'express';
import { join } from 'path';
import cors from 'cors';
import connectDB from './config/db';
import routes from './routes';
import { errorHandler } from './middleware/error';


require('dotenv').config();


const app=express();

connectDB();

app.use(cors());
app.use(json());
app.use(urlencoded({extended:false}));
app.use('/uploads',serveStatic.static(join(__dirname,'uploads')));
app.use('/uploads',express.static(join(__dirname,'uploads')));

app.use('/api',routes);

app.use(errorHandler);
const PORT=process.env.PORT;
app.listen(PORT,()=>console.log(`Server Running on https://${PORT}`))

export default app;