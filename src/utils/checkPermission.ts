import { TokenUser } from "./createTokenUser";
import { Schema, Types, ObjectId } from 'mongoose';
import CustomError from '../errors/index';

const checkPermission = (requestUser: TokenUser, resourceUserId: Types.ObjectId) => {
    
    if (requestUser.role === 'admin') return;
    if(resourceUserId.equals(requestUser.userId)) return // return boolean
    throw new CustomError.UnauthorizedError('Not authorized to access this route')
}

export default checkPermission