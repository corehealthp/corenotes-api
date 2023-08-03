import { NotFoundError } from "@globals/server/Error";
import getCompartmentByCompartmentId from "./db/getCompartmentByCompartmentId";
import fetchServicesDetails from "./fetchServicesDetails";

export interface IFetchCompartment {
    id:string;
    compartmentId:number;
    title:string;
    services:Array<{
        serviceId:number;
        title:string;
        individuals:Array<string>;
        category:string;
    }>;
    image:string;
    staffRoles:Array<string>;
    assignedIndividuals:Array<string>;
    createdAt:Date;
}

export default function fetchCompartment(compartmentId:number) {
    return new Promise<IFetchCompartment>(async (resolve, reject)=> {
        await getCompartmentByCompartmentId(compartmentId)
        .then(async (foundCompartment)=> {
            if(!foundCompartment) {
                new NotFoundError('Compartment not found');
                reject(NotFoundError)
            }

            const compartment:IFetchCompartment = {
                id: foundCompartment._id.toString(),
                compartmentId: foundCompartment.compartmentId,
                title: foundCompartment.title,
                services: await fetchServicesDetails(foundCompartment.services),
                image: foundCompartment.image,
                staffRoles: foundCompartment.staffRoles,
                assignedIndividuals: foundCompartment.assignedIndividuals,
                createdAt: foundCompartment.createdAt
            }

            resolve(compartment)
        })
        .catch((error)=> reject(error))
    })
}