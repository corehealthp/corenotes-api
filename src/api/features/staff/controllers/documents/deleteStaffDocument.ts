import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { Request,Response } from "express";
import { getStaffUserByStaffId } from "@services/db/staff.service";

export default async function deleteStaffDocument (req: Request, res: Response) {
  const staffId = req.params.staffId;
  const documentId = req.params.id;

  try {
   
    const staff = await getStaffUserByStaffId(staffId);

    if (!staff) {
      return sendSuccessResponse({
        res,
        statusCode: 404,
        message: "Staff not found",
      });
    }

    const documentIndex = staff.documents.findIndex((doc:any) => doc.id === documentId);

    staff.documents.splice(documentIndex, 1);

    await staff.save();

        return sendSuccessResponse({
          res,
          statusCode: 200,
          message: "Staff document deleted successfully",
          data: { documents: staff.documents },
        });
  } catch (error) {
    console.error('Error deleting staff document:', error);
        return sendFailureResponse({
          res,
          statusCode: 500,
          message: "There was an error deleting staff document",
          
      });
    
  }
};