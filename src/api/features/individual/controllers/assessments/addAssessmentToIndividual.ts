import { assessmentModel } from "src/api/features/assessment/model/assessment.model.ts";
import {
  sendFailureResponse,
  sendNotFoundFailureResponse,
  sendServerFailureResponse,
  sendSuccessResponse,
  sendValidationFailureResponse,
} from "@globals/server/serverResponse";
import getAssessmentsByIndividualId from "@individual/services/individualAssesments/getAssessmentsByIndividualObjectId";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service";
import { Request, Response } from "express";
import {
  IIndividualAssessmentDocument,
  IndividualAssessmentModel,
  Question,
} from "@individual/models/individual-assessment.model";
import validateAnswer from "../services/assessments/validateQuestionAnswers";

export default function addAssessmentToIndividual(req: Request, res: Response) {
  if (!req.params.individualId)
    return sendValidationFailureResponse(
      res,
      "Individual id parameter cannot be empty"
    );
  if (!req.body.questions?.length)
    return sendValidationFailureResponse(
      res,
      "Questions field cannot be empty"
    );
  try {
    req.body.questions.forEach((question: Question) => {
      validateAnswer(question);
    });
  } catch (error: unknown) {
    const typedError = error as Error;
    return sendFailureResponse({
      res,
      statusCode: 400,
      message: typedError.message,
    });
  }

  const assessment: IIndividualAssessmentDocument = {
    questions: req.body.questions,
    category: req.body.category,
    individualId: parseInt(req.params.individualId),
  };

  getIndividualByIndividualId(req.params.individualId)
    .then(async (foundIndividual) => {
      if (!foundIndividual)
        return sendNotFoundFailureResponse(res, "Individual not found");

      IndividualAssessmentModel.create(assessment)
        .then((assessment) => {
          if (!assessment)
            console.log(`Assessment ${assessment} could not be created`);
          console.log(
            `Individual ${foundIndividual._id.toString()} assigned to assessment ${assessment} successfully`
          );
        })
        .catch((error) => {
          console.log(
            "There was an error adding individual id to assessment assignees",
            error
          );
          return sendServerFailureResponse(
            res,
            "There was an error adding assessment to individual"
          );
        });

      getAssessmentsByIndividualId(req.params.individualId, 1)
        .then((foundIndividualAssessments) => {
          return sendSuccessResponse({
            res,
            statusCode: 200,
            message: "Assessment assigned to individual successfully",
            data: { individualAssessments: foundIndividualAssessments },
          });
        })
        .catch((error) => {
          console.log(
            "There was an error getting individual assessments list",
            error
          );
          return sendServerFailureResponse(
            res,
            "There was a server error, please try again."
          );
        });
    })
    .catch((error) => {
      console.log("There was an error", error);
      return sendServerFailureResponse(
        res,
        "There was a server error, please try again."
      );
    });
}
