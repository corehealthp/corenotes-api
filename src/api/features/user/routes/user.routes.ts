import validateToken from "@globals/middlewares/validateToken";
import { fetchProfile } from "@user/controllers";
import { Router } from "express";

const userRouter = Router();

userRouter.get('/profile/:userId',validateToken, fetchProfile);

export default userRouter 