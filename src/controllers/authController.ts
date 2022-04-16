import { Request, Response } from 'express';
import CustomError from '../errors/index';
import User from '../models/User';
import createTokenUser from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';

const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) throw new CustomError.BadRequestError('Email already exist');

    // Define role if user is the first user
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser })

}

const login = async (req: Request, res: Response) => {
    res.send('Login')
}

const logout = async (req: Request, res: Response) => {
    res.send('Logout')
}

export {
    register,
    login,
    logout
}