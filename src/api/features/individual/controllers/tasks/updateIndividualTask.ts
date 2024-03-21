import { Request, Response } from "express";
import {
  sendFailureResponse,
  sendSuccessResponse,
} from "@globals/server/serverResponse";
import {
  IIndividualTaskDocument,
  IndividualTaskModel,
} from "@individual/models/individual-task.model";

export default async function updateTaskById(req: Request, res: Response) {
  const { taskId } = req.params;

  if (!taskId) {
    return sendFailureResponse({
      res,
      statusCode: 400,
      message: "Missing taskId parameter",
    });
  }

  const updateFields = req.body; // Fields to be updated

  try {
    const updatedTask: IIndividualTaskDocument | null =
      await IndividualTaskModel.findByIdAndUpdate(taskId, updateFields, {
        new: true,
      });

    if (!updatedTask) {
      return sendFailureResponse({
        res,
        statusCode: 404,
        message: "Task not found",
      });
    }

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return sendFailureResponse({
      res,
      statusCode: 500,
      message: "Failed to update task",
    });
  }
}
