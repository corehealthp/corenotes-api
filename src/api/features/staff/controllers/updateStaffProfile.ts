import { NotFoundError, ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { hashPassword } from "@services/security/password";
import updateStaffProfileByStaffId from "@staff/services/db/updateStaffProfileByStaffId";
import { Request, Response } from "express";

export default function updateStaffProfile(req:Request, res:Response) {
    
    const updateProps = {
        phoneNumber: {
            work: req.body.phoneNumber.work,
            cell: req.body.phoneNumber.cell,
            other:req.body.phoneNumber.other,
        },
        emergencyContact: {
            name: req.body.emergencyContact.name,
            relationship: req.body.emergencyContact.relationship,
            phoneNumber: req.body.emergencyContact.phoneNumber
        },
        providerRole: req.body.providerRole,
        firstname:req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username:req.body.username,
        password: req.body.password ? hashPassword(req.body.password) : undefined,
        nickname: req.body.nickname,
        initials: req.body.initials,
        dob: req.body.dob,
        gender: req.body.gender,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        title: req.body.title,
        hiredAt:req.body.hiredAt,
        employeeId:req.body.employeeId,
        profileImage: req.body.profileImage,
        jobSchedule: req.body.jobSchedule,
    }

   
    updateStaffProfileByStaffId(req.body.staffId, updateProps)
    .then((updatedStaff)=> {
        if(!updatedStaff) {
            const notFoundError = new NotFoundError("Staff profile not found");
            return sendFailureResponse({
                res,
                statusCode: notFoundError.statusCode,
                message: notFoundError.message
            })
        }

        return sendSuccessResponse({
            res,
            statusCode: 200,
            message: "Staff profile has been updated successfully",
            data: {
                staff: (updatedStaff)
            }
        })
    })
    .catch((error)=> {
        console.log('Error updating staff profile',error)
        const serverError = new ServerError();
        return sendFailureResponse({
            res,
            statusCode: serverError.statusCode,
            message: serverError.message
        })
    })
}
