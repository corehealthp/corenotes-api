
import { Request, Response } from "express";
import staffClockModel from "@staff/model/staffClock.model";
import Staff from "../../model/staff.model";

export default async function staffClockIn(req: Request, res: Response) {
  if (!req.body.staffId) return res.status(401).send("Staff Id is inavalid");
  if (!req.body.startAt)
    return res.status(401).send("Please Attach Clock in Date Time");

  const clockIn = new staffClockModel({
    ...req.body,
  });
  await clockIn.save();
  const staff = await Staff.findOne({ _id:req.body.staffId });
  staff.isClockedIn=true
  await staff.save();

  res.status(201).json({clockinData:clockIn, staffData:staff, message: "Staff clocked in Successfully" });
}


