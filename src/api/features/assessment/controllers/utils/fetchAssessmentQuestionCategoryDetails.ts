import { Types,  } from "mongoose";
import { AssessmentQuestionsCategoryModel } from "src/api/features/assessment/model/assessment.model.ts";

export default async function fetchAssessmentQuestionCategoryDetails(categoryId:string) {
    return new Promise<string>((resolve)=> {

        if(!Types.ObjectId.isValid(categoryId)) return resolve(categoryId)

        const query = { _id: categoryId }

        AssessmentQuestionsCategoryModel.findOne(query)
        .then((foundCategory)=> {
            if (!foundCategory) resolve('');
            resolve(foundCategory.name.toString());
        })
        .catch((error)=> {
            console.log('QUERY ERROR: There was an error finding assessment category details => ', error);
            resolve('');
        })
    })
}