import { Request, Response } from "express";
import {
  sendFailureResponse,
  sendSuccessResponse,
} from "@globals/server/serverResponse";
import {
  IIndividualTaskDocument,
  IndividualTaskModel,
} from "@individual/models/individual-task.model";

export default async function getTasksByIndividualId(
  req: Request,
  res: Response
) {
  const { individualId } = req.params;

  if (!individualId) {
    return sendFailureResponse({
      res,
      statusCode: 400,
      message: "Missing individualId parameter",
    });
  }

  try {
    const tasks: IIndividualTaskDocument[] = await IndividualTaskModel.find({
      individualId,
    });

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    return sendFailureResponse({
      res,
      statusCode: 500,
      message: "Failed to retrieve tasks",
    });
  }
}
