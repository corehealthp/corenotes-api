import fetchAssessmentCategoryDetails from "@assessment/controllers/utils/fetchAssessmentCategoryDetails";
import { Types, isValidObjectId } from "mongoose";
import { assessmentModel } from "src/api/features/assessment/model/assessment.model.ts";

interface IAssessmentsResponse {
    currentPage:number; 
    totalPages:number;
    assessments:IMappedAssessment[];
}

export interface IMappedAssessment {
    id:string;
    assessmentId:number;
    title:string;
    category:string;
    questionsCount:number;
    assignees:string;
}

export default function fetchAllAssessments(pageNumber:number) {
    return new Promise<IAssessmentsResponse>((resolve, reject)=> {
        const   queryPageNumber = pageNumber - 1 ?? 0,
                resultsPerPage = 10, 
                pageOffset = resultsPerPage * queryPageNumber,

            query = { };

        assessmentModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundAssessments)=> {

            const mappedAssessments:IMappedAssessment[] = [];

            for await (const assessment of foundAssessments) {

                // let category =  "";  
                
                // if(Types.ObjectId.isValid(assessment?.category)) {
                //     // console.log(assessment.category)
                const category = (await fetchAssessmentCategoryDetails(assessment.category))
                //     console.log(assessment.title, category)
                // }

                mappedAssessments.push({
                    id: assessment._id.toString(),
                    assessmentId: assessment.assessmentId,
                    title: assessment.title,
                    category:  category,
                    questionsCount: assessment.questions.length,
                    assignees: `${assessment.assignees?.length} individuals`
                });
            }

            assessmentModel.count(query)
            .then((totalAssessments)=> {
                const totalPageNumber = Math.ceil(totalAssessments / resultsPerPage);

                resolve({
                    currentPage: pageNumber, 
                    totalPages: totalPageNumber,
                    assessments: mappedAssessments
                })
            })
        })
        .catch((error)=> reject(error))
    })
}