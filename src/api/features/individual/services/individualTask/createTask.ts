import { Response } from "express";

import { sendFailureResponse } from "@globals/server/serverResponse";
import { registerIndividualRequestBodyType } from "@individual/controllers/register/types";
import {
  IIndividualTaskDocument,
  IndividualTaskModel,
} from "@individual/models/individual-task.model";
import { IIndividualDocument } from "@individual/models/types";
import serviceModel from "src/api/features/services/models/service.model";

export default async function createServiceTask(
  individual: IIndividualDocument,
  res: Response
) {
  individual.services?.forEach(async (service) => {
    const taskService = await serviceModel.findById(service.serviceId);

    console.log("TASK_SERVICE", taskService);

    if (taskService) {
      const task: IIndividualTaskDocument = {
        individualId: individual.individualId,
        individualName: `${individual.firstname} ${individual.lastname}`,
        schedule: individual.services?.[0]?.schedule,
        serviceType: taskService.category,
        staffRole: individual.services?.[0]?.staffRole!,
        serviceId: individual.services?.[0]?.serviceId,
        status: individual.services?.[0]?.staffRoleStatus!,
      };

      await IndividualTaskModel.create(task)
        .then((createdTask) => {
          console.log("Added task to individual", createdTask);
        })
        .catch((error) => {
          console.error("Error adding task to individual:", error);
          return sendFailureResponse({
            res,
            statusCode: 500,
            message: "Failed to add task to individual",
          });
        });
    }
  });
}
