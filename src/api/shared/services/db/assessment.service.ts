import { createAssessmentReqBodyType } from "@assessment/controllers/createAssessment/types";
import { assessmentModel } from "src/api/features/assessment/model/assessment.model.ts";
import { IAssessmentDocument } from "src/api/features/assessment/model/assessment.model.ts/types";


export function fetchAssessmentsByPage() {
    
}

export function createAssessment(newAssessmentObj:createAssessmentReqBodyType) {
    return new Promise<IAssessmentDocument|null>((resolve, reject)=> {
        assessmentModel.create(newAssessmentObj)
        .then((createdAssessment)=> resolve(createdAssessment))
        .catch((error)=> reject(error))
    })
}

export function getAssessmentByTitle(title:string) {
    return new Promise<IAssessmentDocument|null>((resolve, reject)=> {
        
        const query = { title: title.toLowerCase()  }

        assessmentModel.findOne(query)
        .then((foundAssessment)=> resolve(foundAssessment))
        .catch(error => reject(error))
    })
}

export function getAssessmentByObjId(assessmentObjId:string) {
    return new Promise<IAssessmentDocument|null>((resolve, reject)=> {
        
        const query = { _id: assessmentObjId }

        assessmentModel.findOne(query)
        .then((foundAssessment)=> resolve(foundAssessment))
        .catch(error => reject(error))
    })
}

export function getAssessmentByAssessmentId(assessmentId:number) {
    return new Promise<IAssessmentDocument|null>((resolve, reject)=> {
        
        const query = { assessmentId };

        assessmentModel.findOne(query)
        .then((foundAssessment)=> resolve(foundAssessment))
        .catch((error)=> reject(error))
    })
}