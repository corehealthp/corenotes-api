import { Request, Response } from "express"
import UserModel from "@user/models/user.model"
import { hashPassword } from "src/api/shared/services/security/password";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import updateStaffPassword from "@staff/services/updateStaffPassword";
import { IStaffDocument } from "@staff/model/types";
import { ServerError } from "@globals/server/Error";
import staffModel from "@staff/model/staff.model";
import { sendResetEmail } from "src/api/features/email/email.controller";
import { randomBytes } from "crypto";

export default async function forgotPassword (req:Request, res:Response) {

    const { email } = req.body;
    try {
      const user = await staffModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const resetToken = randomBytes(20).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  
      await user.save();
      // Implement the sendResetEmail function separately
      sendResetEmail(email, resetToken);
      res.json({
        message: "Reset token generated. Check your email for instructions.",
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
}