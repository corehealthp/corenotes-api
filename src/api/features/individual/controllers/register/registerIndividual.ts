import { Request, Response } from "express";
import validateRegisterIndividual from "./validateRegisterIndividual";
import { validateRegisterIndividualRequestBodyType } from "./types";
import fetchIndividuals from "../fetchIndividuals";
import { sendFailureResponse } from "@globals/server/serverResponse";
import { updateServiceAssignedIndividualsById } from "src/api/shared/services/db/service.service";
import { individualModel } from "@individual/models/individual.model";
import addIndividualToCompartment from "src/api/features/compartment/services/addIndividualToCompartment";

export default function registerIndividual(req: Request, res: Response) {
  validateRegisterIndividual({ ...req.body })
    .then(({ requestBody }: validateRegisterIndividualRequestBodyType) => {
      individualModel
        .create({
          firstname: requestBody.firstname,
          middlename: requestBody.middlename,
          lastname: requestBody.lastname,
          nickname: requestBody.nickname,

          dob: requestBody.dob,
          gender: requestBody.gender,
          religion: requestBody.religion,

          ssn: requestBody.ssn,
          insurance:requestBody.insurance,
          insuranceNo:requestBody.insuranceNo,
          otherInsuranceNo:requestBody.insuranceNo,
          
          contact: {
            name: requestBody.contact.name,
            email: requestBody.contact.email,
            phoneNumber: requestBody.contact.phoneNumber,
          },
          weight: requestBody.weight,
          medicareNo: requestBody.medicareNo,
          medicareIdNo: requestBody.medicareIdNo,
          maritalStatus: requestBody.maritalStatus,

          codeAlert: requestBody.codeAlert,
          compartment: requestBody.compartment,
          subCompartment: requestBody.subCompartmentId,
          services: requestBody.requestedServices,
          diet: requestBody.diet,
          allergies: {
            food: requestBody.allergies.food,
            med: requestBody.allergies.med,
            other: requestBody.allergies.other,
          },
        })
        .then((newIndividual) => {
          console.log(`REGISTRATION: New individual registered successfully`);
          
          addIndividualToCompartment(requestBody.compartment, requestBody.subCompartmentId, newIndividual.id)
          .then(()=> console.log("Individual added to subcompartment successfully"))
          .catch(()=> console.log("Individual wasn't added to subcompartment successfully"))

          requestBody.requestedServices.forEach(async (service) => {
            await updateServiceAssignedIndividualsById(service.service, newIndividual._id.toString())
            .finally(() => fetchIndividuals(req, res));
          });
        })
        .catch((error) => {
          console.log(error);
          return sendFailureResponse({
            res,
            statusCode: 422,
            message:
              error.message ?? "There was an error creating new individual",
          });
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
