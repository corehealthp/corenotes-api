import calcAge from "@globals/helpers/calcAge";
import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { IIndividualDocument } from "@individual/models/types";
import { getCompartmentById } from "src/api/shared/services/db/compartment.service";

export interface IFetchIndividualResponse {
    currentPage:number;
    totalPages:number,
    individuals:IIndividualListItem[];
    total:number;
}

export interface IIndividualListItem {
    id:string;
    individualId:number;
    profileImage:string;
    firstname:string;
    lastname:string;
    age:number;
    gender:string;
    compartment:string;
    medicareIdNo:number;
}

export default function fetchAllIndividuals(pageNumber:number) {
    return new Promise<IFetchIndividualResponse>((resolve, reject)=> {
        const   queryPageNumber = pageNumber - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * queryPageNumber;

        const query = { active: true }

        individualModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundIndividuals:IIndividualDocument[])=> {
        
            if(!foundIndividuals.length) {
                const notFoundError = new NotFoundError('No individuals found');
                reject(notFoundError)
            }

            const mappedIndividuals:IIndividualListItem[] = [];

            for await ( const individual of foundIndividuals ) {
                mappedIndividuals.push({
                    id: individual._id.toString(),
                    individualId: individual.individualId,
                    profileImage: individual.profileImage,
                    firstname: individual.firstname,
                    lastname: individual.lastname,
                    age: calcAge(individual.dob),
                    gender: individual.gender,
                    compartment: (await getCompartmentById(individual.compartment))!.title,
                    medicareIdNo: individual.medicareIdNo
                })
            }

            individualModel.count()
            .then((totalIndividualCount)=> {
                
                const totalPageNumber = Math.ceil(totalIndividualCount / resultsPerPage);

                resolve({
                    currentPage: pageNumber, 
                    totalPages: totalPageNumber,
                    individuals: mappedIndividuals,
                    total: totalIndividualCount
                })
            })
        })
        .catch((error)=> {
            console.log(`USER FETCH ERROR: There was an error retrieving individuals. `, error)
            reject(error)
        })
    })
}