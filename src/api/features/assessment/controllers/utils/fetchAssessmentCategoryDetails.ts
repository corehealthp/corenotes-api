import { Types, isValidObjectId } from "mongoose";
import { AssessmentCategoryModel } from "src/api/features/assessment/model/assessment.model.ts";
import { IAssessmentCategoryDocument } from "src/api/features/assessment/model/assessment.model.ts/types";


export default async function fetchAssessmentCategoryDetails(categoryId:string) {
    return new Promise<string>((resolve)=> {
        
        if(!Types.ObjectId.isValid(categoryId)) return resolve(categoryId)

        const query = { _id: categoryId }
    
        return AssessmentCategoryModel.findOne(query)
        .then((foundCategory:IAssessmentCategoryDocument)=> {
            if(!foundCategory) resolve('');
            return foundCategory.name;
        })
        .catch((error)=> {
            console.log('QUERY ERROR: There was an error finding assessment category details => ', error);
            return '';
        })
    })
}