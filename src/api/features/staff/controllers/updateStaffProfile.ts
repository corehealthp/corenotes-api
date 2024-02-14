import { NotFoundError, ServerError } from "@globals/server/Error";
import {
  sendFailureResponse,
  sendSuccessResponse,
} from "@globals/server/serverResponse";
import { hashPassword } from "@services/security/password";
import updateStaffProfileByStaffId from "@staff/services/db/updateStaffProfileByStaffId";
import { Request, Response } from "express";

export default async function updateStaffProfile(req: Request, res: Response) {
  const updateProps: Record<string, any> = {};

  for (const key in req.body) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      if (key === "password") {
        updateProps[key] = await hashPassword(req.body[key]);
      } else {
        updateProps[key] = req.body[key];
      }
    }
  }

  updateStaffProfileByStaffId(req.body.staffId, updateProps)
    .then((updatedStaff) => {
      if (!updatedStaff) {
        const notFoundError = new NotFoundError("Staff profile not found");
        return sendFailureResponse({
          res,
          statusCode: notFoundError.statusCode,
          message: notFoundError.message,
        });
      }

      return sendSuccessResponse({
        res,
        statusCode: 200,
        message: "Staff profile has been updated successfully",
        data: {
          staff: updatedStaff,
        },
      });
    })
    .catch((error) => {
      console.log("Error updating staff profile", error);
      const serverError = new ServerError();
      return sendFailureResponse({
        res,
        statusCode: serverError.statusCode,
        message: serverError.message,
      });
    });
}
