import { Request, Response } from 'express';
import CustomError from '../errors/index';
import User from '../models/User';
import createTokenUser from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';


const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req: Request, res: Response) => {
    const { params: { id: userId } } = req;
    const user = await User.find({ _id: userId });
    if (!user) throw new CustomError.NotFoundError(`No user match with this id: ${userId}`)
    // Check permission
    res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req: Request, res: Response) => {
    res.send('update user')
}

const updateUserPassword = async (req: Request, res: Response) => {
    res.send('update user password')
}

export { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword }