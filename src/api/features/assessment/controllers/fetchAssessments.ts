import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchAllAssessments from "@assessment/services/fetchAllAssessments";
import { assessmentModel } from "@assessment/model/assessment.model.ts";

export default async function fetchAssessments(req:Request, res:Response) {
    // fetchAllAssessments(parseInt(req.params.pageNumber))
    // .then((assessmentResponse)=> {
    //     return sendSuccessResponse({
    //         res, 
    //         statusCode: 200, 
    //         message: "Assessments retrieved successfully", 
    //         data: assessmentResponse 
    //     })
    // })
    // .catch((error)=> {
    //     console.log(`QUERY ERROR: There was an error fetching all assessments`)
    //     console.log(error)
    //     return sendFailureResponse({res, statusCode:500, message:"There was an error fetching assessments"})
    // })
    
    try {
        const fetchAssessments = await assessmentModel.find().sort({ createdAt: -1 });
        res.status(200).json(fetchAssessments);
      } catch (err) {
        res.status(500).json(err);
      }

            
    // assessmentModel.find(query)
    // .skip(pageOffset)
    // .limit(resultsPerPage)
    // .sort({ createdAt: -1 })
    // .then(async (foundAssessments:IAssessment[])=> {

    //     // assign the found assessments to this individual
        
    //     const individualQuery = { _id: req.params.individualId }

    //     const individualAssessments:Array<{
    //         assessmentId:Types.ObjectId|String,
    //         status:'PENDING'|'IN-PROGRESS'|'COMPLETED'
    //     }> = [];

    //     const mappedAssessments:any[] = [];

    //     for await (const assessment of foundAssessments) {
    //         let assessmentMap:IAssessmentMapped = {
    //             id:assessment._id,
    //             title: assessment.title,
    //             category: await fetchAssessmentCategoryDetails(assessment.category),
    //             questions: [],
    //             status: 'COMPLETED'
    //         };
        
    //         await userModel.findOne(individualQuery)
    //         .then(async(foundIndividual:IUserDocument)=> {
    //             if(foundIndividual && !foundIndividual.assessments.filter( individualAssessment => individualAssessment.assessmentId === assessment._id.toString()).length) {
    //                 individualAssessments.push({
    //                     assessmentId: assessment._id,
    //                     status: 'PENDING',
    //                 })
    //             }
                
    //             const assessmentExistsCheck = foundIndividual.assessments.filter( individualAssessment => individualAssessment.assessmentId === assessment._id.toString());
    //             assessmentMap.status =  assessmentExistsCheck.length ? assessmentExistsCheck[0].status : 'PENDING'

    //             for await (const question of assessment.questions) {
    //                 assessmentMap.questions.push({
    //                     question: question.question,
    //                     category: await fetchAssessmentQuestionCategoryDetails(question.category)
    //                 })
    //             }
    //         })
            
    //         mappedAssessments.push(assessmentMap)
    //     }

    //     userModel.findOneAndUpdate(
    //         individualQuery,
    //         { $push: { assessments: individualAssessments } },
    //         { new: true } 
    //     ).then((updatedUser)=> {
    //         console.log('INDIVIDUAL PROFILE: New Individual assessments added successfully')

    //         assessmentModel.count(query)
    //         .then((totalAssessments)=> {
    //             const totalPageNumber = Math.ceil(totalAssessments / resultsPerPage);
    //             return sendSuccessResponse({res, statusCode:200, message:"Assessments retrieved successfully", data:{ 
    //                 currentPage: parseInt(req.params.pageNumber), 
    //                 totalPages: totalPageNumber,
    //                 assessments: mappedAssessments
    //             }})
    //         })
    //     }).catch((error)=> {
    //         console.log('INDIVIDUAL PROFILE ERROR: There was an error assigning new tasks to individual profile')
    //     })
    // })
    // .catch((error)=> {
    //     console.log(`QUERY ERROR: There was an error fetching all assessments`)
    //     console.log(error)
    //     return sendFailureResponse({res, statusCode:500, message:"There was an error fetching assessments"})
    // })

}