import express, { Application, Request, Response } from 'express';
import "express-async-errors";
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDb from './db/connect';

import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import { authenticateUser } from './middleware/authenticate';

import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';

dotenv.config()
const app: Application = express();

// Middleware 
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users',authenticateUser, userRouter)

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