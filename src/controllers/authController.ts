import { Request, Response } from 'express';

const register = async (req: Request, res: Response) => {
    res.send('Register')
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