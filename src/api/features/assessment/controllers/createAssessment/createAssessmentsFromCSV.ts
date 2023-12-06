import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse, sendValidationFailureResponse } from "@globals/server/serverResponse";
import csv from "csvtojson";
import { createAssessment } from "@services/db/assessment.service";
import { createAssessmentReqBodyType } from "./types";
import fetchAllAssessments from "@assessment/services/fetchAllAssessments";

export function createAssessmentsFromCSV(req:Request, res:Response) {
    if(!req.file) return sendValidationFailureResponse(res, "Please upload a file");

    csv().fromFile(req.file.path)
    .then((jsonObj)=> {

        const fileName:string = req.file?.originalname.substring(0, req.file?.originalname.lastIndexOf(".")) ?? ""

        const assessmentTitle = fileName.substring(0, fileName.lastIndexOf("("));

        const assessmentCategory = fileName.substring(fileName.lastIndexOf("(") + 1, fileName.lastIndexOf(")")) + " assessment";

        const newAssessmentObj:createAssessmentReqBodyType = {
            title: assessmentTitle.trim(),
            category: assessmentCategory.trim(),
            questions: jsonObj
        }

        createAssessment(newAssessmentObj)
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
                console.log(`QUERY ERROR: There was an error fetching all assessments`, error)
                return sendFailureResponse({
                    res, 
                    statusCode:500, 
                    message:"There was an error fetching assessments"
                })
            })
        })
    })
}