import { Request, Response } from "express";
import validateAssignIndividualServiceRequest from "../../services/validateAssignIndividualServiceRequest";
import { ServerError, ValidationError } from "@globals/server/Error";
import {
  sendFailureResponse,
  sendSuccessResponse,
} from "@globals/server/serverResponse";
import addServiceToIndividual from "../../services/addServiceToIndividual";
import { getServiceByObjectId } from "src/api/shared/services/db/service.service";
import createSkinIntegrityTask from "src/api/features/task/services/skin-integrity/createSkinIntegrityTask";
import { IIMakeSkinIntegrityTaskDets } from "src/api/features/task/services/skin-integrity/makeSkinIntegrityTask";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service";
import { IIMakeBowelMovementTaskDets } from "src/api/features/task/services/bowel-movement/makeBowelMovementTask";
import createBowelMovementTask from "src/api/features/task/services/bowel-movement/createBowelMovementTask";
import createShiftNotesTask from "src/api/features/task/services/shift-notes/createShiftNotesTask";
import { IIMakeShiftNotesTaskDets } from "src/api/features/task/services/shift-notes/makeShiftNotesTask";
import { IIMakeBloodGlucoseCheckTaskDets } from "src/api/features/task/services/blood-glucose-check/makeBloodGlucoseCheckTask";
import createBloodGlucoseCheckTask from "src/api/features/task/services/blood-glucose-check/createBloodGlucoseCheckTask";
import { IIMakeSeizureTrackingTaskDets } from "src/api/features/task/services/seizure-tracking/makeSeizureTrackingTask";
import createSeizureTrackingTask from "src/api/features/task/services/seizure-tracking/createSeizureTrackingTask";
import { IIMakeFireDrillTaskDets } from "src/api/features/task/services/fire-drill/makeFireDrillTask";
import createFireDrillTask from "src/api/features/task/services/fire-drill/createFireDrillTask";
import createTornadoDrillTask from "src/api/features/task/services/tornado-drill/createTornadoDrillTask";
import { IIMakeTornadoDrillTaskDets } from "src/api/features/task/services/tornado-drill/makeTornadoDrillTask";
import serviceModel from "src/api/features/services/models/service.model";
import { individualModel } from "@individual/models/individual.model";
import {
  IIndividualTaskDocument,
  IndividualTaskModel,
} from "@individual/models/individual-task.model";
import staffroleModel from "@staff/model/staffrole.model";

export default async function updateIndividualServices(
  req: Request,
  res: Response
) {
  try {
    
    // Find the individual by ID and update the specific service status
    const updatedIndividual = await individualModel.findOneAndUpdate(
      {
        individualId: req.params.individualId,
        "services.serviceId": req.params.serviceId,
      },
      {
        $set: {
          "services.$.serviceId": req.body.serviceId,
          "services.$.staffRole": req.body.staffRole,
          "services.$.schedule.startDate": req.body.startDate,
          "services.$.schedule.time": req.body.time,
          "services.$.status": req.body.status,
        },
      },
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedIndividual) {
      throw new Error("Individual not found");
    }

    const fetchTasks = await individualModel
      .find({}, "individualId firstname lastname services")
      .sort({ createdAt: -1 });

    const flattenedServices = await Promise.all(
      fetchTasks.flatMap(async (task) => {
        return await Promise.all(
          task.services.map(async (service) => {
            // Fetch service details using serviceId
            const serviceDetails = await serviceModel.findById(
              service.serviceId
            );
            const serviceType = serviceDetails ? serviceDetails.title : null;

            // Fetch staff details using staffRole
            const staffDetails = await staffroleModel.findOne({
              _id: service.staffRole,
            });
            const staffTitle = staffDetails ? staffDetails.title : null;
            return {
              firstname: task.firstname,
              lastname: task.lastname,
              individualId: task.individualId,
              //@ts-ignore
              ...service._doc,
              serviceType: serviceType,
              staffTitle: staffTitle,
            };
          })
        );
      })
    );

    res
      .status(200)
      .json({
        message: "Staus Changed Successfully",
        data: flattenedServices.flat(),
      });
  } catch (error) {
    console.error("Error updating service status:", error);
  }

  //   individualData.services?.forEach(async (service) => {
  //     if (service.serviceId) {
  //       console.log("SERVICE", service);

  //       const taskService = await serviceModel.findById(service.serviceId);

  //       console.log("TASK_SERVICE", taskService);

  //       if (taskService) {
  //         const task: IIndividualTaskDocument = {
  //           individualId: individualData.individualId,
  //           individualName: `${individualData.firstname} ${individualData.lastname}`,
  //           schedule: individualData.services?.[0]?.schedule,
  //           serviceType: taskService.category,
  //           staffRole: individualData.services?.[0]?.staffRole!,
  //           serviceId: individualData.services?.[0]?.serviceId,
  //           status: individualData.services?.[0]?.staffRoleStatus!,
  //         };

  //         await IndividualTaskModel.create(task)
  //           .then((createdTask) => {
  //             console.log("Added task to individual", createdTask);
  //           })
  //           .catch((error) => {
  //             console.error("Error adding task to individual:", error);
  //             return sendFailureResponse({
  //               res,
  //               statusCode: 500,
  //               message: "Failed to add task to individual",
  //             });
  //           });
  //       }
  //     }
  //   });
  // }

  // return sendSuccessResponse({
  //   res,
  //   statusCode: 201,
  //   message: "New service added to individual successfully",
  //   // data: { individualServices },
  // });
}
