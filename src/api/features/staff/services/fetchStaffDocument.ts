import { getStaffUserByStaffId } from "src/api/shared/services/db/staff.service";
import { IStaffDocument } from "@staff/model/types";

export interface IStaffProfileDocuments {
    id:string;
    docTitle: string;
    docType: string;
    docDate: string;
    docFileLink: string;
    docFileName: string;
    createdAt: Date
}

interface IFetchStaffProfileDocumentsResponse {
    documents:Array<IStaffProfileDocuments>;
}

export default function fetchStaffDocument(staffId:number) {
    return new Promise<IFetchStaffProfileDocumentsResponse>((resolve, reject)=> {

        getStaffUserByStaffId(staffId)
        .then(async (foundStaff:IStaffDocument)=> {
            
        
            const documentsForClient:IStaffProfileDocuments[] = foundStaff.documents.map((document)=>(
              {
                id: document._id.toString(),
                docTitle: document.docTitle,
                docType: document.docType,
                docFileName: document.docFileName,
                docDate: document.docDate,
                docFileLink: document.docFileLink,
                createdAt: document.createdAt
              }
            ))
            resolve({ 
                documents: documentsForClient
            })
        })
        .catch((error)=> reject(error))
    })
}