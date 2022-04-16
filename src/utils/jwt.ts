import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { TokenUser } from './createTokenUser';

interface IPayload {
    payload: TokenUser
}

interface IToken {
    token: string
}

interface IAttachCookiesToResponse {
    res: Response,
    user: TokenUser
}

const createJWT = ({ payload }: IPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_LIFETIME });
    return token
};

const isTokenValid = ({ token }: IToken) => {
    return jwt.verify(token, process.env.JWT_SECRET as string)
};

const attachCookiesToResponse = ({ res, user }: IAttachCookiesToResponse) => {
    const token = createJWT({ payload: user });
    const time = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + time),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
}

export { createJWT, isTokenValid, attachCookiesToResponse };

