import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/index';
import { TokenUser } from '../utils/createTokenUser';
import { isTokenValid } from '../utils/jwt';

declare module "express-serve-static-core" {
    interface Request {
        user: TokenUser
    }
}

declare module "express" {
    interface Request {
        user: TokenUser
    }
}

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies.token;
    if (!token) throw new CustomError.UnauthenticatedError('Authentication invalid');

    try {
        const { name, userId, role } = isTokenValid({ token }) as TokenUser;
        req.user = { name, userId, role };
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication invalid')
    }
}

const authorizePermissions = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access this route')
        }
        next()
    }
}

export { authenticateUser, authorizePermissions }