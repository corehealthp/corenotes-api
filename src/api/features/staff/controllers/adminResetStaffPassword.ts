import { NotFoundError, ServerError } from "@globals/server/Error";
import {
  sendFailureResponse,
  sendSuccessResponse,
} from "@globals/server/serverResponse";
import { hashPassword } from "@services/security/password";
import Staff from "../model/staff.model";
import updateStaffProfileByStaffId from "@staff/services/db/updateStaffProfileByStaffId";
import { Request, Response } from "express";

export default function adminResetStaffPasword(req: Request, res: Response) {

  const { newPassword } = req.body;

  hashPassword(newPassword)
    .then(async (hashedPassword) => {
      try {
        const user = await Staff.findOne({ _id: req.params.staffId });

        if (!user) {
          return res.status(400).json({ message: "Invalid User account" });
        }
        user.password = hashedPassword;

        await user.save();

        res.json({ message: "Password reset successful" });
      } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    })
    .catch((error) => {
      const serverError = new ServerError();
      return sendFailureResponse({
        res,
        statusCode: serverError.statusCode,
        message: serverError.message,
      });
    });
}
