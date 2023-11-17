import { Model, Schema, model, models } from "mongoose";
import { ICompartment } from "./types";
import autoIncrementPlugin from "src/config/database/autoIncrementInit"

<<<<<<< HEAD
export = Model<ICompartment> = models.compartments || model<ICompartment>('compartments', new Schema<ICompartment>({
=======
const compartmentModel:Model<ICompartment> = models.compartments || model<ICompartment>('compartments', new Schema<ICompartment>({
>>>>>>> 4c0bf23a89c42992065c41b867232e976ab40894
    compartmentId:{ type:Number },
    title:{ type:String },
    image:{ type:String }, 
    services:Array<String>,
    staffRoles:[String],
    assignedIndividuals:[String],
    meta: {
        bgColor: { type:String },
        labelColor: { type:String }
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
}).plugin(autoIncrementPlugin, {
    model: 'compartments',
    field: 'compartmentId',
    startAt: 1,
}));