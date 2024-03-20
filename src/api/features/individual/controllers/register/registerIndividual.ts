import { Request, Response } from "express";

import {
  sendFailureResponse,
  sendSuccessResponse,
} from "@globals/server/serverResponse";
import { updateServiceAssignedIndividualsById } from "src/api/shared/services/db/service.service";
import { individualModel } from "@individual/models/individual.model";
import addIndividualToCompartment from "src/api/features/compartment/services/addIndividualToCompartment";
import { registerIndividualRequestBodyType } from "./types";
import fetchIndividuals from "../fetchIndividuals";
import { IIndividualDocument } from "@individual/models/types";
import {
  IIndividualTaskDocument,
  IndividualTaskModel,
} from "@individual/models/individual-task.model";
import serviceModel from "src/api/features/services/models/service.model";
import createServiceTask from "@individual/services/individualTask/createTask";

export default async function registerIndividual(req: Request, res: Response) {
  const individualData: registerIndividualRequestBodyType = {
    firstname: req.body.firstname?.toLowerCase(),
    middlename: req.body.middlename?.toLowerCase(),
    lastname: req.body.lastname?.toLowerCase(),
    nickname: req.body.nickname?.toLowerCase(),

    dob: req.body.dob,
    gender: req.body.gender,

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
    medicareNo: req.body.medicareNo,
    medicaidNumber: req.body.medicaidNumber,
    activityLimitations: req.body.activityLimitations,
    dischargePlan: req.body.dischargePlan,
    expectedDurationOfService: req.body.expectedDurationOfService,
    hardOfHearing: req.body.hardOfHearing,
    medicallyFrail: req.body.medicallyFrail,
    oxygen: req.body.oxygen,
    proneToFalling: req.body.proneToFalling,
    shortnessOfBreath: req.body.shortnessOfBreath,
    seizureActivity: req.body.seizureActivity,
    visionLoss: req.body.visionLoss,
    weigthBearingLimitation: req.body.weigthBearingLimitation,
    incontinentSafety: req.body.incontinentSafety,
    daysOfService: req.body.daysOfService,
    expectedFrequency: req.body.expectedFrequency,
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

  // Filter out specified fields with empty string or null values
  const filteredIndividualData = Object.fromEntries(
    Object.entries(individualData).filter(
      ([key, value]) =>
        // Check if the field is not one of the specified fields or if it has a non-empty value
        ![
          "ssn",
          "insurance",
          "insuranceNo",
          "otherInsuranceNo",
          "medicareNo",
          "medicaidNumber",
          "compartment",
          "subCompartmentId",
        ].includes(key) || ![null, ""].includes(value)
    )
  );

  const checkFields = [
    "ssn",
    "insurance",
    "insuranceNo",
    "otherInsuranceNo",
    "medicaidNumber",
  ];

  // Use aggregation pipeline for efficient conflict check
  const conflictingIndividuals = await individualModel.aggregate([
    {
      $match: {
        $or: checkFields.map((field) => ({
          [field]: { $eq: req.body[field] }, // Explicitly use $eq for comparison
        })),
      }, // Check for any field-value pair match using $eq
    },
    {
      $limit: 1, // Limit to 1 document if found (enough for conflict)
    },
  ]);

  if (conflictingIndividuals.length > 0) {
    console.log(conflictingIndividuals[0]);

    const conflictingIndividual = conflictingIndividuals[0]; // First document
    const conflictedField = checkFields.find(
      (field) =>
        conflictingIndividual[field] !== undefined && // Check for existence first
        conflictingIndividual[field].toString() === req.body[field].toString() // Stringify for comparison
    );

    const conflictingValue =
      req.body[conflictedField as keyof IIndividualDocument];

    // Return an error response indicating the conflicted field and value (if available)
    return sendFailureResponse({
      res,
      statusCode: 409, // Conflict error code
      message: `${conflictedField?.toUpperCase()}${
        conflictingValue ? ` (Value: ${conflictingValue})` : ""
      } already exists in another individual document`,
    });
  }

  individualModel
    .create(filteredIndividualData)
    .then(async (newIndividual) => {
      console.log(`REGISTRATION: New individual registered successfully`);
      await addIndividualToCompartment(
        req.body.compartment!,
        req.body.subCompartmentId!,
        newIndividual._id.toString()
      )
        .then(() =>
          console.log("Individual added to subcompartment successfully")
        )
        .catch(() =>
          console.log("Individual wasn't added to subcompartment successfully")
        );

      await createServiceTask(newIndividual, res);
      fetchIndividuals(req, res);
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
