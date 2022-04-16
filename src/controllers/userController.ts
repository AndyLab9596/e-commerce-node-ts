import { Request, Response } from 'express';

const getAllUsers = async (req: Request, res: Response) => {
    res.send('Get All Users')
}

const getSingleUser = async (req: Request, res: Response) => {
    res.send('Get All Users')
}

const showCurrentUser = async (req: Request, res: Response) => {
    res.send('Get All Users')
}

const updateUser = async (req: Request, res: Response) => {
    res.send('Get All Users')
}

const updateUserPassword = async (req: Request, res: Response) => {
    res.send('Get All Users')
}

export { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword }