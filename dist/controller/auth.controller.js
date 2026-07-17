import { ZodError } from 'zod';
import loginSchema from '../schema/login.schema.js';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import jwt from 'jsonwebtoken';
import errorUtil from '../utils/error.util.js';
import { envConfig } from '../config/config.js';
export const loginController = async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);
        const { email, password } = data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            throw errorUtil('Invalid credentials', 401);
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword)
            throw errorUtil('Invalid credentials', 401);
        const accessToken = await jwt.sign({ userId: user.id }, envConfig.JWT_SECRET, {
            expiresIn: '15m',
            algorithm: 'HS256',
        });
        const refreshToken = await jwt.sign({ userId: user.id }, envConfig.JWT_SECRET, {
            expiresIn: '30d',
            algorithm: 'HS256',
        });
        const isProd = envConfig.NODE_ENV === 'production';
        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: '.aastugibigubae.com',
            path: '/',
        });
        res.status(200).json({
            success: true,
            message: 'User Logged in Successfully',
            data: {
                email: user.email,
                accessToken,
            },
        });
    }
    catch (err) {
        if (err instanceof ZodError) {
            const error = new Error(err.issues.map((e) => e.message).join(', '));
            error.status = 400;
            return next(error);
        }
        return next(err);
    }
};
export const refreshController = async (req, res, next) => {
    try {
        const existingToken = req.cookies['refresh-token'];
        if (!existingToken)
            throw errorUtil('Invalid Grant ', 401);
        const decoded = jwt.verify(existingToken, envConfig.JWT_SECRET);
        const userId = decoded.userId;
        const accessToken = await jwt.sign({ userId }, envConfig.JWT_SECRET, {
            expiresIn: '15m',
            algorithm: 'HS256',
        });
        res.status(201).json({
            success: true,
            message: 'Access token created successfuly',
            data: {
                accessToken,
            },
        });
    }
    catch (err) {
        return next(err);
    }
};
