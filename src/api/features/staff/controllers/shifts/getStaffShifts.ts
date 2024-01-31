import { sendNotFoundFailureResponse, sendServerFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { getStaffUserByStaffId } from "src/api/shared/services/db/staff.service";
import fetchStaffShifts from "@staff/services/shifts/fetchStaffShifts";
import { Request, Response } from "express";
import staffClockModel from "@staff/model/staffClock.model";

export default async function getStaffShift(req:Request, res:Response) {
    try {
        const singleUser = await staffClockModel.find({staffId:req.params.staffId}).sort({ createdAt: -1 });
       
        res.status(200).json(singleUser);
      } catch (err) {
        res.status(500).json(err);
      }
}