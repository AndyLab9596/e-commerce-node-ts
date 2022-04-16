import { Request, Response } from 'express';
import CustomError from '../errors/index';
import User, { IUser } from '../models/User';
import createTokenUser from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import checkPermission from '../utils/checkPermission';


const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req: Request, res: Response) => {
    const { params: { id: userId } } = req;
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) throw new CustomError.NotFoundError(`No user match with this id: ${userId}`)
    // Check permission
    checkPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req: Request, res: Response) => {
    const { body: { email, name }, user: { userId } } = req;
    if (!email || !name) throw new CustomError.BadRequestError('Please provide all values');

    const user = await User.findOne({ _id: userId }) as IUser;

    user.email = email;
    user.name = name;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser })

}

const updateUserPassword = async (req: Request, res: Response) => {
    const { body: { oldPassword, newPassword }, user: { userId } } = req;
    if (!oldPassword || !newPassword) throw new CustomError.BadRequestError('Please provide both values');

    const user = await User.findOne({ _id: userId }) as IUser;
    const isPasswordCorrect = await user?.comparePassword(oldPassword);
    if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError('Credential invalid');

    user.password = newPassword;

    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' })
}

export { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword }