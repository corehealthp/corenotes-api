import { Request, Response } from "express";
import completeTask from "../../services/completeTask";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import createBowelMovementHistory from "../../services/bowel-movement/history/createBowelMovementHistory";
import createShiftNotesHistory from "../../services/shift-notes/history/createShiftNotesHistory";

export default function completeShiftNotesTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        staffId: req.currentUser.staffObjectId!,
        note: req.body.note
    }

    validateShiftNotesTaskRequest(requestData)
    .then((data)=> {
        // create goal tracking history within individual goal tracking field
        completeTask(data.taskId)
        .then((completedTask)=> {
            if(!completedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            createShiftNotesHistory({
                individualId: completedTask.individualId,
                staffId: data.staffId,
                note: data.note
            })
            .then(()=> {

                fetchTaskDetails(completedTask.taskId)
                .then((foundTask)=> {
                    console.log("Shift notes created successfully");
                    return sendSuccessResponse({ res, statusCode: 201, message:"Shift notes task completed successfully", data: { task: foundTask } })  
                })
                .catch((error)=> {
                    console.log(error);
                    return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message });    
                })
            })
            .catch((error)=> {
                console.log(error);
                return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message });
            })
        })
        .catch((error)=> {
            console.log(error);
            return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message });
        })
    })
    .catch((error)=> {
        console.log(error);
        return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message });
    });
}

export interface ICompleteShiftNotesTaskRequest {
    taskId:number;
    staffId:string;
    note:string;
}

export function validateShiftNotesTaskRequest(data:ICompleteShiftNotesTaskRequest) {
    return new Promise<ICompleteShiftNotesTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });
        if(!data.note) reject({ code:401, message:"Note field must be provided" });

        resolve(data)
    })
}