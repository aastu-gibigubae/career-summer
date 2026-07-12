import errorUtil from '../utils/error.util.js';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/config.js';
import prisma from '../config/db.js';
export default async function authorize(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw errorUtil('Unauthorized', 401);
        }
        const accessToken = authHeader.split(' ')[1];
        const decoded = jwt.verify(accessToken, envConfig.JWT_SECRET);
        const userId = decoded.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw errorUtil('Unauthorized', 401);
        }
        next();
    }
    catch (err) {
        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            return next(errorUtil("Unauthorized", 401));
        }
        return next(err);
    }
}
