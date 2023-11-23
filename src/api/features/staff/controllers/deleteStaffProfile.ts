import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { getStaffUserByStaffId } from "@services/db/staff.service";
import { Request, Response } from "express";
export default function deleteStaffProfile(req:Request,res:Response){
  getStaffUserByStaffId(parseInt(req.params.staffId))
  .then(async (foundStaff)=> {
    console.log(foundStaff)
     await foundStaff.deleteOne()

      return sendSuccessResponse({
          res, 
          statusCode: 200, 
          message: "Staff profile deleted successfully",
      })
  })
  .catch((error)=> {
    console.error("Error deleting staff:", error);
      return sendFailureResponse({
          res,
          statusCode:500, 
          message:"There was an error deleting staff profile"
      })
  })
}