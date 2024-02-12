import { Schema, Types, model, models } from "mongoose";
import { IStaffClock } from "./types";

export default models.staffClock || model('staffClock', new Schema<IStaffClock>({
    staffId: {
        type:String
    },
    startAt: {
        type:String
    },
    from: {
        type:String
    },
    to: {
        type:String
    },
    comment: {
        type:String
    },
    EndAt: {
        type:String
    },
    
}, { timestamps:{} }))