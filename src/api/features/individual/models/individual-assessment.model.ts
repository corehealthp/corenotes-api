import { sendFailureResponse } from "@globals/server/serverResponse";
import { model, Schema, Types, Model } from "mongoose";
import { Response } from "express";
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

// Enum for different reply types
export enum ReplyType {
  YES_NO = "YES_NO",
  STRING = "STRING",
  NUMBER = "NUMBER",
  INCIDENT_REPORT = "INCIDENT_REPORT",
  MULTIPLE_ANSWERS = "MULTIPLE_ANSWERS",
}

// Define the specific string types for certain question replies
export enum IncidentReportType {
  BEHAVIORAL = "BEHAVIORAL",
  MEDICAL = "MEDICAL",
  INJURY = "INJURY",
  THEFT = "THEFT",
  OTHER = "OTHER",
}

// Interface for question object
export interface Question {
  question: string;
  replyType: ReplyType;
  category?: string;
  answer: string | number | IncidentReportType;
}

// Interface for the individual assessment document
export interface IIndividualAssessmentDocument {
  individualId: number;
  category: string;
  questions: Question[];
}

// Create the schema
const individualAssessmentSchema = new Schema<IIndividualAssessmentDocument>({
  individualId: { type: Number, required: true },
  category: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      category: { type: String, sparse: true },
      replyType: {
        type: String,
        enum: Object.values(ReplyType),
        required: true,
      },
      answer: {
        type: Schema.Types.Mixed,
        required: true,
      },
    },
  ],
});

individualAssessmentSchema.plugin(autoIncrementPlugin, {
  model: "individual-assessments",
  field: "sessionId",
  startAt: 1,
});

// Export the model
export const IndividualAssessmentModel: Model<IIndividualAssessmentDocument> =
  model<IIndividualAssessmentDocument>(
    "IndividualAssessment",
    individualAssessmentSchema
  );
