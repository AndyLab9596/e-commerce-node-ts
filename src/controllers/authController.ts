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
    const { email, password } = req.body;
    if (!email || !password) throw new CustomError.BadRequestError('Please provide email and password !');

    const user = await User.findOne({ email });
    if (!user) throw new CustomError.UnauthenticatedError('Invalid credential')

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError('Invalid credential');

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const logout = async (req: Request, res: Response) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({ msg: "logged out" })
}

export {
    register,
    login,
    logout
}