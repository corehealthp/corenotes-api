import { Request, Response } from "express";
import fetchIndividuals from "../fetchIndividuals";
import { sendFailureResponse } from "@globals/server/serverResponse";
import { updateServiceAssignedIndividualsById } from "src/api/shared/services/db/service.service";
import { individualModel } from "@individual/models/individual.model";
import addIndividualToCompartment from "src/api/features/compartment/services/addIndividualToCompartment";
import { registerIndividualRequestBodyType } from "./types";

export default function registerIndividual(req: Request, res: Response) {
  const individualData: registerIndividualRequestBodyType = {
    firstname: req.body.firstname?.toLowerCase(),
    middlename: req.body.middlename?.toLowerCase(),
    lastname: req.body.lastname?.toLowerCase(),
    nickname: req.body.nickname?.toLowerCase(),

    dob: req.body.dob,
    gender: req.body.gender,
    religion: req.body.religion,

    ssn: req.body.ssn,
    insurance: req.body.insurance,
    insuranceNo: req.body.insuranceNo,
    otherInsuranceNo: req.body.otherInsuranceNo,

    contact: {
      name: req.body.contact?.name?.toLowerCase(),
      email: req.body.contact?.email?.toLowerCase(),
      phoneNumber: req.body.contact?.phoneNumber,
    },
    weight: req.body.weight,
    medicareIdNo: req.body.medicareIdNo,
    medicaidNumber: req.body.medicaidNumber,
    maritalStatus: req.body.maritalStatus,

    codeAlert: req.body.codeAlert,
    compartment: req.body.compartment,
    subCompartmentId: req.body.subCompartmentId,
    services: req.body.requestedServices,
    diet: req.body.diet,
    allergies: {
      food: req.body.allergies?.food,
      med: req.body.allergies?.med,
      other: req.body.allergies?.other,
    },
  };

  individualModel
    .create(individualData)
    .then((newIndividual) => {
      console.log(`REGISTRATION: New individual registered successfully`);

      addIndividualToCompartment(
        req.body.compartment!,
        req.body.subCompartmentId!,
        newIndividual.id
      )
        .then(() =>
          console.log("Individual added to subcompartment successfully")
        )
        .catch(() =>
          console.log("Individual wasn't added to subcompartment successfully")
        );

      individualData.services?.forEach(async (service) => {
        if (service.service)
          await updateServiceAssignedIndividualsById(
            service?.service,
            newIndividual._id.toString()
          ).finally(() => fetchIndividuals(req, res));
      });
    })
    .catch((error) => {
      console.log(error);
      return sendFailureResponse({
        res,
        statusCode: 422,
        message: error.message ?? "There was an error creating new individual",
      });
    });
}
