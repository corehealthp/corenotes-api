import { Request, Response } from "express";

import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { updateServiceAssignedIndividualsById } from "src/api/shared/services/db/service.service";
import { individualModel } from "@individual/models/individual.model";
import addIndividualToCompartment from "src/api/features/compartment/services/addIndividualToCompartment";
import { registerIndividualRequestBodyType } from "./types";
import fetchIndividuals from "../fetchIndividuals";

// export default async function registerIndividual(req: Request, res: Response) {
//   const individualData: registerIndividualRequestBodyType = {
//     firstname: req.body.firstName?.toLowerCase(),
//     middlename: req.body.middleName?.toLowerCase(),
//     lastname: req.body.lastName?.toLowerCase(),
//     nickname: req.body.nickName?.toLowerCase(),

//     dob: req.body.dob,
//     gender: req.body.gender,

//     ssn: req.body.ssn,
//     insurance: req.body.insurance,
//     insuranceNo: req.body.insuranceNo,
//     otherInsuranceNo: req.body.otherInsuranceNo,

//     contact: {
//       name: req.body.contact?.name?.toLowerCase(),
//       email: req.body.contact?.email?.toLowerCase(),
//       phoneNumber: req.body.contact?.phoneNumber,
//     },
//     weight: req.body.weight,
//     medicareNo: req.body.medicareNo,
//     medicaidNumber: req.body.medicaidNumber,
//     activityLimitations: req.body.activityLimitations,
//     dischargePlan: req.body.dischargePlan,
//     expectedDurationOfService: req.body.expectedDurationOfService,
//     hardOfHearing: req.body.hardOfHearing,
//     medicallyFrail: req.body.medicallyFrail,
//     oxygen: req.body.oxygen,
//     proneToFalling: req.body.proneToFalling,
//     shortnessOfBreath: req.body.shortnessOfBreath,
//     seizureActivity: req.body.seizureActivity,
//     visionLoss: req.body.visionLoss,
//     weigthBearingLimitation: req.body.weigthBearingLimitation,
//     incontinentSafety: req.body.incontinentSafety,
//     daysOfService: req.body.daysOfService,
//     expectedFrequency: req.body.expectedFrequency,
//     codeAlert: req.body.codeAlert,
//     compartment: req.body.compartment,
//     subCompartmentId: "6568103d086f91a30566d131",
//     services: req.body.requestedServices,
//     diet: req.body.diet,
//     allergies: {
//       food: req.body.allergies?.food,
//       med: req.body.allergies?.med,
//       other: req.body.allergies?.other,
//     },
//   };
//   individualModel
//     .create(individualData)
//     .then((newIndividual) => {
//       console.log(`REGISTRATION: New individual registered successfully`);

//       addIndividualToCompartment(
//         req.body.compartment!,
//         req.body.subCompartmentId!,
//         newIndividual.id
//       )
//         .then(() =>
//           console.log("Individual added to subcompartment successfully")
//         )
//         .catch(() =>
//           console.log("Individual wasn't added to subcompartment successfully")
//         );

//       individualData.services?.forEach(async (service) => {
//         if (service.service)
//           await updateServiceAssignedIndividualsById(
//             service?.service,
//             newIndividual._id.toString()
//           ).finally(() => fetchIndividuals(req, res));
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       return sendFailureResponse({
//         res,
//         statusCode: 422,
//         message: error.message ?? "There was an error creating new individual",
//       });
//     });
// }

export default async function registerIndividual(req: Request, res: Response) {
  const individualData: registerIndividualRequestBodyType = {
    firstname: req.body.firstName?.toLowerCase(),
    middlename: req.body.middleName?.toLowerCase(),
    lastname: req.body.lastName?.toLowerCase(),
    nickname: req.body.nickName?.toLowerCase(),

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
    subCompartmentId: "6568103d086f91a30566d131",
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
    .then(async (newIndividual) => {
      console.log(`REGISTRATION: New staff registered successfully`);

      const allIndividual = await individualModel.find().sort({createdAt: -1});
      return sendSuccessResponse({
        res,
        statusCode: 201,
        message: "Individual registered successfully",
        data: allIndividual,
      });
    }).catch((error) => {
      console.log(`There was an error creating new staff: `, error);
      sendFailureResponse({
        res,
        statusCode: 422,
        message: "There was an error creating new staff",
      });
    });
}

// export default async function registerIndividual(req: Request, res: Response) {
//   const individualData: registerIndividualRequestBodyType = {
//     firstname: req.body.firstName?.toLowerCase(),
//     middlename: req.body.middleName?.toLowerCase(),
//     lastname: req.body.lastName?.toLowerCase(),
//     nickname: req.body.nickName?.toLowerCase(),

//     dob: req.body.dob,
//     gender: req.body.gender,

//     ssn: req.body.ssn,
//     insurance: req.body.insurance,
//     insuranceNo: req.body.insuranceNo,
//     otherInsuranceNo: req.body.otherInsuranceNo,

//     contact: {
//       name: req.body.contact?.name?.toLowerCase(),
//       email: req.body.contact?.email?.toLowerCase(),
//       phoneNumber: req.body.contact?.phoneNumber,
//     },
//     weight: req.body.weight,
//     medicareNo: req.body.medicareNo,
//     medicaidNumber: req.body.medicaidNumber,
//     activityLimitations: req.body.activityLimitations,
//     dischargePlan: req.body.dischargePlan,
//     expectedDurationOfService: req.body.expectedDurationOfService,
//     hardOfHearing: req.body.hardOfHearing,
//     medicallyFrail: req.body.medicallyFrail,
//     oxygen: req.body.oxygen,
//     proneToFalling: req.body.proneToFalling,
//     shortnessOfBreath: req.body.shortnessOfBreath,
//     seizureActivity: req.body.seizureActivity,
//     visionLoss: req.body.visionLoss,
//     weigthBearingLimitation: req.body.weigthBearingLimitation,
//     incontinentSafety: req.body.incontinentSafety,
//     daysOfService: req.body.daysOfService,
//     expectedFrequency: req.body.expectedFrequency,
//     codeAlert: req.body.codeAlert,
//     compartment: req.body.compartment,
//     subCompartmentId: "6568103d086f91a30566d131",
//     services: req.body.requestedServices,
//     diet: req.body.diet,
//     allergies: {
//       food: req.body.allergies?.food,
//       med: req.body.allergies?.med,
//       other: req.body.allergies?.other,
//     },
//   };


//   // Filter out specified fields with empty string or null values
//   const filteredIndividualData = Object.fromEntries(
//     Object.entries(individualData).filter(
//       ([key, value]) =>
//         // Check if the field is not one of the specified fields or if it has a non-empty value
//         ![
//           "ssn",
//           "insurance",
//           "insuranceNo",
//           "otherInsuranceNo",
//           "medicareNo",
//           "medicaidNumber",
//           "compartment",
//           "subCompartmentId",
//         ].includes(key) || ![null, ""].includes(value)
//     )
//   );

//   individualModel
//     .create(filteredIndividualData)
//     .then((newIndividual) => {
//       console.log(`REGISTRATION: New individual registered successfully`);
//       addIndividualToCompartment(
//         req.body.compartment!,
//         req.body.subCompartmentId!,
//         newIndividual._id.toString()
//       )
//         .then(() =>
//           console.log("Individual added to subcompartment successfully")
//         )
//         .catch(() =>
//           console.log("Individual wasn't added to subcompartment successfully")
//         );

//       individualData.services?.forEach(async (service) => {
//         if (service.service)
//           await updateServiceAssignedIndividualsById(
//             service?.service,
//             newIndividual._id.toString()
//           ).finally(() => fetchIndividuals(req, res));
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       return sendFailureResponse({
//         res,
//         statusCode: 422,
//         message: error.message ?? "There was an error creating new individual",
//       });
//     });
// }