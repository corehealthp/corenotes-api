import { Request, Response } from "express";
import validateCreateAssessmentReq from "./validateCreateAssessmentReq";
import { validateCreateAssessmentType } from "./types";
import { assessmentModel } from "src/api/features/assessment/model/assessment.model.ts";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchAllAssessments from "@assessment/services/fetchAllAssessments";

export default function postCreateAssessment(req:Request, res:Response) {
    validateCreateAssessmentReq(req.body)
    .then(({requestBody}:validateCreateAssessmentType)=> {

        let newAssessmentObj:any = {
            title: requestBody.title.toLowerCase(),
            category: requestBody.category,
            questions: requestBody.questions,
        }

        assessmentModel.create(newAssessmentObj)
        .then(()=> {
            fetchAllAssessments(1)
            .then((assessmentResponse)=> {
                return sendSuccessResponse({
                    res, 
                    statusCode: 200, 
                    message: "RESOURCE CREATED: new assessment created successfully", 
                    data: assessmentResponse
                })
            })
            .catch((error)=> {
                console.log(`QUERY ERROR: There was an error fetching all assessments`)
                console.log(error)
                return sendFailureResponse({res, statusCode:500, message:"There was an error fetching assessments"})
            })
        })
        .catch((error)=> {
            console.log(error)
            sendFailureResponse({res, statusCode:422, message:error.message ?? "There was an error creating new assessment"});
        })
    })
    .catch((error)=> {
        console.log('VALIDATION ERROR: ', error.message)
        sendFailureResponse({res, statusCode:422, message:error.message ?? "There was an error validating new assessment body"});
    })
}