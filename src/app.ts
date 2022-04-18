import express, { Application, Request, Response } from 'express';
import "express-async-errors";
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

import connectDb from './db/connect';

import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import { authenticateUser } from './middleware/authenticate';

import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import productRouter from './routes/productRoutes';
import reviewRouter from './routes/reviewRoutes';
import orderRouter from './routes/orderRoutes';

dotenv.config()
const app: Application = express();

// Security packages
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
}))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

// Middleware 
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authenticateUser, userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDb(process.env.MONGO_URL as string)
        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`)
        })
    } catch (err) {
        console.log(err)
    }
}
start()