import { Request, Response } from "express"
import fetchCompartment from "../services/fetchCompartment"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { ServerError } from "@globals/server/Error"

export default function fetchCompartmentDetails(req:Request, res:Response) {
    fetchCompartment(parseInt(req.params.compartmentId))
    .then((fetchCompartment)=> {
        sendSuccessResponse({
            res, 
            statusCode: 200, 
            message:"Compartment details retrieved successfully",
            data: { compartment: fetchCompartment }
        })
    })
    .catch((error)=> {
        console.log("There was an error fetching compartment")
        console.log(error)
        
        if(error.statusCode) {
            return sendFailureResponse({ res, statusCode: error.statusCode,  message: error.message });    
        }

        const serverError = new ServerError();
        return sendFailureResponse({ res, statusCode: serverError.statusCode,  message: serverError.message });
    })
}