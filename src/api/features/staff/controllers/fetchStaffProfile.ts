import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { Request, Response } from "express"
import { getStaffRoleById, getStaffUserByStaffId } from "src/api/shared/services/db/staff.service"
import Staff from "../model/staff.model";

// export default function fetchStaffProfile(req:Request, res:Response) {

//     getStaffUserByStaffId(req.params._id)
//     .then(async (foundStaff)=> {
//         foundStaff.providerRole = (await getStaffRoleById(foundStaff.providerRole))?.title;
//         return sendSuccessResponse({
//             res, 
//             statusCode: 200, 
//             message: "Staff profile retrieved successfully", 
//             data: { staff: foundStaff }
//         })
//     })
//     .catch((error)=> {
//         console.log('error fetching staff profile', error)
//         return sendFailureResponse({
//             res,
//             statusCode:500, 
//             message:"There was an error fetching staff profile"
//         })
//     })
// }





export default async function fetchStaffProfile(req:Request, res:Response) {
    console.log(req.params.staffId)
    try {
        const singleUser = await Staff.findOne({_id:req.params.staffId});
       
        res.status(200).json({staff:singleUser});
      } catch (err) {
        res.status(500).json(err);
      }
}