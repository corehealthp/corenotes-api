import { ObjectId } from "mongoose";

export interface IService {
    _id:ObjectId;
    serviceId:number;
    title:string;
    refName:string;
    category:string;
    compartments:Array<string>;
    staffRoles:Array<string>;
    assignedIndividuals:Array<string>;
    medications:Array<string>;
    createdAt:Date;
    // status:string;
    // individualId
}