import compartmentModel from "../models/compartment.model";
import { ICompartment } from "../models/types";
import { ICompartmentFormat } from "./types";


export default function fetchAllCompartments(pageNumber:number) {
    return new Promise<ICompartmentFormat[]>((resolve, reject)=> {

        const queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        compartmentModel.find()
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then((foundCompartments:ICompartment[])=> {

            const formattedCompartments:ICompartmentFormat[] = foundCompartments.map((compartment)=> {
                return {
                    id: compartment._id.toString(),
                    compartmentId: compartment.compartmentId,
                    title: compartment.title,
                    image: compartment.image,
                    staffRoles: compartment.staffRoles,
                    assignedIndividuals: compartment.assignedIndividuals,
                    createdAt: compartment.createdAt.toString()
                }
            })

            resolve(formattedCompartments)
        })
        .catch((error)=> {
            console.log('COMPARTMENT ERROR: There was an error fetching all compartments')
            reject(error)
        })
    })
}