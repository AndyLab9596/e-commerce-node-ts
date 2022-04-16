import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import "express-async-errors";
import connectDb from './db/connect';

dotenv.config()
const app: Application = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})

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