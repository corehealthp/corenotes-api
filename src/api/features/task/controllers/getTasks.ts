import { Request, Response } from "express";
import { individualModel } from "@individual/models/individual.model";
import serviceModel from "../../services/models/service.model";
import staffModel from "@staff/model/staff.model";
import staffroleModel from "@staff/model/staffrole.model";

export default async function getTasks(req: Request, res: Response) {
  try {
    const fetchTasks = await individualModel
      .find({}, "individualId firstname lastname services")
      .sort({ createdAt: -1 });

    const flattenedServices = await Promise.all(
      fetchTasks.flatMap(async (task) => {
        return await Promise.all(
          task.services.map(async (service) => {
            // Fetch service details using serviceId
            const serviceDetails = await serviceModel.findById(service.serviceId);
            const serviceType = serviceDetails ? serviceDetails.title : null;

                // Fetch staff details using staffRole
                const staffDetails = await staffroleModel.findOne({ _id: service.staffRole });
                const staffTitle = staffDetails ? staffDetails.title : null;
                console.log("task",task)
            return {
              firstname: task.firstname,
              lastname: task.lastname,
              individualId:task.individualId,
              //@ts-ignore
              ...service._doc,
              serviceType: serviceType,
              staffTitle:staffTitle,
            };
          })
        );
      })
    );

    res.status(200).json(flattenedServices.flat());

    ;
  } catch (err) {
    res.status(500).json(err);
  }
}
