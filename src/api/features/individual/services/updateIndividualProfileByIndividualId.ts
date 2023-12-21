import { individualModel } from "@individual/models/individual.model"

export default function updateIndividualProfileByIndividualId(individualId:string, updateProps:object) {
    return new Promise((resolve, reject)=> {
        
        const query = { individualId: parseInt(individualId) }
        const updateObj = { $set: updateProps }

        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedStaff)=> resolve(updatedStaff))
        .catch((error)=> reject(error))
    })
}