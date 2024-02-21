import { Request, Response } from "express";
import fetchAllStaffRoles from "../../services/roles/fetchAllStaffRoles";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";
import staffroleModel from "@staff/model/staffrole.model";

export default async function fetchStaffRoles(req:Request, res:Response) {
    fetchAllStaffRoles()
    // .then((responseData)=> {
    //     return sendSuccessResponse({ 
    //         res, 
    //         statusCode: 200, 
    //         message: "Staff roles retrieved successfully", 
    //         data: responseData 
    //     })
    // })
    // .catch((error)=> {
        
    //     console.log("There was an error fetching all staff roles ", error);

    //     const serverError = new ServerError();
    //     return sendFailureResponse({res, statusCode: serverError.statusCode, message: serverError.message})
    // })
    try {
        const fetchStaffRole = await staffroleModel.find().sort({ createdAt: -1 });
        res.status(200).json(fetchStaffRole);
      } catch (err) {
        res.status(500).json(err);
      }
}