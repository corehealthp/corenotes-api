import { NotFoundError, ServerError } from "@globals/server/Error";
import {
  sendFailureResponse,
  sendSuccessResponse,
} from "@globals/server/serverResponse";
import updateIndividualProfileByIndividualId from "@individual/services/updateIndividualProfileByIndividualId";
import { Request, Response } from "express";

export default function updateIndividualProfile(req: Request, res: Response) {
  const updateProps = {
    contact: {
      name: req.body.personalInformation.contact.name,
      phoneNumber: req.body.personalInformation.contact.phoneNumber,
    },
    allergies: {
      food: [req.body.healthInformation.allergies.food],
      med: [req.body.healthInformation.allergies.meds],
      other: [req.body.healthInformation.allergies.others],
    },
    firstname: req.body.personalInformation.firstName,
    middlename: req.body.personalInformation.middleName,
    lastname: req.body.personalInformation.lastName,
    nickname: req.body.personalInformation.nickName,
    dob: req.body.personalInformation.dob,
    gender: req.body.personalInformation.gender,
    ssn: req.body.personalInformation.ssn,
    medicaidNumber: req.body.personalInformation.medicaidNumber,
    medicareNo: req.body.personalInformation.medicareNumber,
    codeAlert: req.body.personalInformation.codeAlert,
    weight: req.body.personalInformation.weight,
    profileImage: req.body.personalInformation.profileImage,
    compartment: req.body.personalInformation.compartment,
    compartmentId: req.body.personalInformation.compartmentId,
    diet: req.body.healthInformation.diet,

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
  };

  updateIndividualProfileByIndividualId(req.body.individualId, updateProps)
    .then((updatedIndividual:any) => {
      if (!updatedIndividual) {
        const notFoundError = new NotFoundError("Individual profile not found");
        return sendFailureResponse({
          res,
          statusCode: notFoundError.statusCode,
          message: notFoundError.message,
        });
      }
      const updatedData = {
        personalInformation: {
          firstName: updatedIndividual.firstname,
          middleName: updatedIndividual.middlename,
          lastName: updatedIndividual.lastname,
          nickname: updatedIndividual.nickname,
          gender: updatedIndividual.gender,
          medicaidNumber: updatedIndividual.medicaidNumber,
          dob: updatedIndividual.dob,
          ssn: updatedIndividual.ssn,
          weight: updatedIndividual.weight, 
          contact: updatedIndividual.contact,
          compartment: updatedIndividual.compartment
        },
        healthInformation: {
          diet: updatedIndividual.diet,
          allergies: updatedIndividual.allergies
        },
        activityLimitations: updatedIndividual.activityLimitations,
        dischargePlan: updatedIndividual.dischargePlan,
        daysOfService: updatedIndividual.daysOfService,
        expectedFrequency: updatedIndividual.expectedFrequency,
        expectedDurationOfService: updatedIndividual.expectedDurationOfService,
        hardOfHearing: updatedIndividual.hardOfHearing,
        medicallyFrail: updatedIndividual.medicallyFrail,
        oxygen: updatedIndividual.oxygen,
        proneToFalling: updatedIndividual.proneToFalling,
        seizureActivity: updatedIndividual.seizureActivity,
        shortnessOfBreath: updatedIndividual.shortnessOfBreath,
        visionLoss: updatedIndividual.visionLoss,
        individualId: updatedIndividual.individualId.toString() // Make sure individualId is converted to string
      };
      return sendSuccessResponse({
        res,
        statusCode: 200,
        message: "Individual profile has been updated successfully",
        data: {
          individual: updatedIndividual,
        },
      });
    })
    .catch((error) => {
      console.log("Error updating individual profile", error);
      const serverError = new ServerError();
      return sendFailureResponse({
        res,
        statusCode: serverError.statusCode,
        message: serverError.message,
      });
    });
}
