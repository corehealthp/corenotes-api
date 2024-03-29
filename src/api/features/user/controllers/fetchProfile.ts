import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "src/api/shared/globals/server/serverResponse";
import staffModel from "@staff/model/staff.model";
import { getStaffRoleById } from "src/api/shared/services/db/staff.service";

export default async function fetchProfile (req:Request, res:Response) {
    
    
    // console.log("req.params.userId",req.params.userId)
    // const query = { _id: req.params.userId ?  req.params.userId : req.currentUser.id };
    await staffModel.findOne({_id:req.params.userId})
    .then(async (foundStaff)=> {
        if(!foundStaff) return sendFailureResponse({res, statusCode: 404, message: "Staff User profile doesn't exist"});

        const staffRole = await getStaffRoleById(foundStaff.providerRole)

        const user = {
            _id: foundStaff.id,
            active: foundStaff.active,
            role: {
                title: staffRole?.title.toUpperCase(),
                privileges: staffRole?.privileges
            },
            lastSeen: foundStaff.lastSeen,
            firstname: foundStaff.firstname,
            lastname: foundStaff.lastname,
            isClockedIn: foundStaff.isClockedIn,
            profileImage: foundStaff.profileImage,
        }

        sendSuccessResponse({
            res, 
            statusCode: 200, 
            message: "User retrieved successfully", 
            data: { user }
        });  
    })
    .catch((error)=> {
        console.log(error);
        sendFailureResponse({res, statusCode: 401, message: "Error retrieving user"});
    });
}