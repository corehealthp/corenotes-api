import { NotFoundError, ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import updateIndividualProfileByIndividualId from "@individual/services/updateIndividualProfileByIndividualId";
import { Request, Response } from "express";

export default function updateIndividualProfile(req:Request, res:Response) {
  
  const updateProps = {
        contact: {
          name:req.body.contact.name,
          phoneNumber: req.body.contact.phoneNumber
      },
      allergies: {
        food: [
            req.body.allergies.food
        ],
        med: [
            req.body.allergies.med

        ],
        other: [
            req.body.allergies.other
        ]
    },
    firstname: req.body.firstname,
    middlename:req.body.middlename,
    lastname:req.body.lastname,
    nickname: req.body.nickname,
    dob:req.body.nickname,
    gender:req.body.gender,
    maritalStatus:req.body.maritalStatus,
    religion:req.body.religion,
    ssn:req.body.ssn,
    medicaidNumber:req.body.medicaidNumber,
    codeAlert:req.body.codeAlert,
    weight:req.body.weight,
    profileImage:req.body.profileImage,
    compartment:req.body.compartment,
    diet:req.body.diet
  }

    updateIndividualProfileByIndividualId(req.body.individualId, updateProps)
    .then((updatedIndividual)=> {
        if(!updatedIndividual) {
            const notFoundError = new NotFoundError("Individual profile not found");
            return sendFailureResponse({
                res,
                statusCode: notFoundError.statusCode,
                message: notFoundError.message
            })
        }

        return sendSuccessResponse({
            res,
            statusCode: 200,
            message: "Individual profile has been updated successfully",
            data: {
                staff: (updatedIndividual)
            }
        })
    })
    .catch((error)=> {
        console.log('Error updating individual profile',error)
        const serverError = new ServerError();
        return sendFailureResponse({
            res,
            statusCode: serverError.statusCode,
            message: serverError.message
        })
    })
}