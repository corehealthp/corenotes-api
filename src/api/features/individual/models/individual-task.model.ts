import { sendFailureResponse } from "@globals/server/serverResponse";
import { model, Schema, Types, Model } from "mongoose";
import autoIncrementPlugin from "src/config/database/autoIncrementInit";
import { IIndividualServicesSubDocument } from "./types";

interface Schedule {
  startDate: string;
  time: string;
  frequency: string;
  frequencyAttr: string | number;
}
// Interface for the individual task document
export interface IIndividualTaskDocument {
  individualId: String;
  individualName: string;
  schedule: Schedule;
  serviceType: string;
  staffRole: string;
  serviceId: string;
  status: String;
}

// Create the schema
const individualTaskSchema = new Schema<IIndividualTaskDocument>({
  individualId: { type: Number },
  individualName: { type: String },
  serviceId: {
    type: String,
  },
  staffRole: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
  },

  serviceType: { type: String },
});

// individualTaskSchema.plugin(autoIncrementPlugin, {
//   model: "individual-task",
//   field: "individualId",
//   startAt: 1,
// });

// Export the model
export const IndividualTaskModel: Model<IIndividualTaskDocument> =
  model<IIndividualTaskDocument>("IndividualTask", individualTaskSchema);
