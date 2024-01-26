import { Request, Response } from "express";
import UserModel from "@user/models/user.model";
import { hashPassword } from "src/api/shared/services/security/password";
import {
  sendFailureResponse,
  sendSuccessResponse,
} from "@globals/server/serverResponse";
import updateStaffPassword from "@staff/services/updateStaffPassword";
import { IStaffDocument } from "@staff/model/types";
import { ServerError } from "@globals/server/Error";
import staffModel from "@staff/model/staff.model";

export default function resetStaffPassword(req: Request, res: Response) {
  const { resetToken, newPassword } = req.body;

  hashPassword(newPassword)
    .then(async (hashedPassword) => {
      try {
        const user = await staffModel.findOne({
          resetPasswordToken: resetToken,
          resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
          return res
            .status(400)
            .json({ message: "Invalid or expired reset token" });
        }
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
      } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    })
    .catch((error) => {
      console.log(error);
      const serverError = new ServerError();
      return sendFailureResponse({
        res,
        statusCode: serverError.statusCode,
        message: serverError.message,
      });
    });
}
