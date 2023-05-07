import { Router } from "express"
import authRouter from "./authRouter";
import staffRouter from "./staffRouter";
import userRouter from "./userRouter";

export default function routes (){
    const router = Router();

    router.use('/auth', authRouter)
    router.use('/user', userRouter);
    router.use('/staffs', staffRouter)

    return router
}