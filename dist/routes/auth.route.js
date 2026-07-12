import { Router } from 'express';
import { loginController, refreshController, } from '../controller/auth.controller.js';
const authRouter = Router();
authRouter.post('/auth/login', loginController);
authRouter.post('/auth/refresh', refreshController);
export default authRouter;
