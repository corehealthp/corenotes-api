import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "src/api/shared/globals/server/serverResponse";
import staffModel from "@staff/model/staff.model";
import { getStaffRoleById } from "src/api/shared/services/db/staff.service";

export default function fetchProfile (req:Request, res:Response) {
    
    const userId = req.params?.userId ? req.params?.userId  : req.currentUser?.id;
    const query = { _id:userId};
    console.log(query)

    staffModel.findOne(query)
    .then(async (foundStaff)=> {
        if(!foundStaff) return sendFailureResponse({res, statusCode: 404, message: "Staff User profile doesn't exist"});

        console.log(foundStaff.providerRole)
        const staffRole = await getStaffRoleById(foundStaff.providerRole)

        const user = {
            id: foundStaff.id,
            active: foundStaff.active,
            role: {
                title: staffRole?.title?.toUpperCase(),
                privileges: staffRole?.privileges
            },
            lastSeen: foundStaff.lastSeen,
            firstname: foundStaff.firstname,
            lastname: foundStaff.lastname,
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