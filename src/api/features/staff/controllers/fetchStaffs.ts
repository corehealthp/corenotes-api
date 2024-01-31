import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchAllStaffs from "@staff/services/fetchAllStaffs";
import staffModel from "@staff/model/staff.model";

export default async function fetchStaffs(req:Request, res:Response) {

     try{
          const fetchStaff = await staffModel.find().sort({ createdAt: -1 });
          res.status(200).json(fetchStaff); 

     }
     catch(err){
          res.status(500).json(err);

     }
//    fetchAllStaffs(parseInt(req.params.pageNumber))
//    .then((staffs)=> {
//           return sendSuccessResponse({ 
//                res, 
//                statusCode:200, 
//                message:"Staffs retrieved successfully", 
//                data:staffs 
//           })
//    })
//    .catch(()=> {
//           return sendFailureResponse({ 
//                res, 
//                statusCode: 500, 
//                message: "There was an error fetching staff list" 
//           })
//    })
}