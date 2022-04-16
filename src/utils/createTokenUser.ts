import { IUser } from "../models/User";
import { Types } from 'mongoose'

export interface TokenUser {
    name: string,
    userId: Types.ObjectId,
    role: 'admin' | 'user'
}

const createTokenUser = (user: IUser): TokenUser => {
    return { name: user.name, userId: user._id, role: user.role }
}

export default createTokenUser;