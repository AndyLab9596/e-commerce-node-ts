import express, { Application, Request, Response } from 'express';
import "express-async-errors";
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDb from './db/connect';

import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';

dotenv.config()
const app: Application = express();

// Middleware 
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})

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