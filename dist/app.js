import express from 'express';
import cors from 'cors';
import errorMiddleware from './middlewares/error.middleware.js';
import applicationRouter from './routes/application.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use('/api/v1', applicationRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is live and running',
    });
});
app.use(errorMiddleware);
export default app;
