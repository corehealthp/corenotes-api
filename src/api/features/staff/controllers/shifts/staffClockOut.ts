import { Request, Response } from "express";
import staffClockModel from "@staff/model/staffClock.model";
import Staff from "../../model/staff.model";

export default async function staffClockOut(req: Request, res: Response) {
  if (!req.body.staffId) return res.status(401).send("Staff Id is inavalid");
  if (!req.body.clockInId) return res.status(401).send("inavalid request");
  if (!req.body.EndAt) return res.status(401).send("EndAt is inavalid");
  // get the last clock in record for that particular user
  const updatedClock = await staffClockModel.findByIdAndUpdate(
    req.body.clockInId,
    { $set: req.body },
    { new: true }
  );
  const staff = await Staff.findOne({ _id:req.body.staffId });
  staff.isClockedIn=false
  await staff.save();
  res.status(200).json({clockInData:updatedClock._doc, staffData:staff});
}
