import { Request, Response } from "express"
import validateUploadIndividualRequestBody, { INewDocument } from "./validateUploadIndividualDocument"
import uploadFileToCloud from "src/api/shared/services/fileSystem/uploadFileToCloud"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { ServerError } from "@globals/server/Error"
import fetchAllIndividualDocuments from "@individual/services/documents/fetchAllIndividualDocuments"
import addDocumentToIndividual from "@individual/services/documents/addDocumentToIndividual"

export default function uploadIndividualDocument(req:Request, res:Response) {
    validateUploadIndividualRequestBody({ individualId: req.params.individualId, ...req.body, individualDocFile: req.file})
    .then(({ requestBody })=> {
        uploadFileToCloud(requestBody.individualDocFile, 'individual-documents')
        .then((fileLink:string)=> {

            const newDocument:INewDocument = {
                docTitle: requestBody.docTitle,
                docType: requestBody.docType,
                docDate: requestBody.docDate,
                docFileLink: fileLink,
                docFileName: requestBody.docFileName
            }

            addDocumentToIndividual(requestBody.individualId, newDocument)
            .then(()=> {
                fetchAllIndividualDocuments(requestBody.individualId, 1)
                .then((response)=> {
                    return sendSuccessResponse({
                        res, 
                        statusCode: 200, 
                        message: "New individual document uploaded successfully", 
                        data: response
                    })
                })
                .catch((error)=> {
                    console.log("There was an error fetching updated individual documents list :", error);
                    const serverError = new ServerError()
                    return sendFailureResponse({ 
                        res, 
                        statusCode: serverError.statusCode, 
                        message: serverError.message
                    });
                })
            })
            .catch((error)=> {
                console.log("There was an error adding new individual document :", error);
                const serverError = new ServerError()
                return sendFailureResponse({ 
                    res, 
                    statusCode: serverError.statusCode, 
                    message: serverError.message
                });
            })
        })
        .catch((error)=> {
            // TODO: return error if validation is failed
            console.log(`FILE UPLOAD ERROR: There was an error updating file to CDN server`)
            console.log(error)
            sendFailureResponse({res, statusCode: error.code, message: error.message});
        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        console.log(`VALIDATION ERROR: There was an error validating register individual request body`)
        console.log(error)
        sendFailureResponse({res, statusCode: error.code, message: error.message});
    })
}