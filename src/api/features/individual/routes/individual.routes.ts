import { Router } from "express";
import uploadFile from "../../../shared/globals/middlewares/uploadFile";
import registerIndividual from "../controllers/register/registerIndividual";
import fetchIndividualProfile from "../controllers/profile/fetchIndividualProfile";
import validateToken from "@globals/middlewares/validateToken";
import fetchIndividualServices from "../controllers/services/fetchIndividualServices";
import assignIndividualServices from "../controllers/services/assignIndividualServices";
import postMedicationToIndividual from "@individual/controllers/medications/postMedicationToIndividual";
import getIndividualMedications from "@individual/controllers/medications/getIndividualMedications";
import addGoalTrackingService from "@individual/controllers/services/goal-tracking/addGoalTrakingService";
import fetchIndividualGoalsTrackingServices from "@individual/controllers/services/goal-tracking/fetchIndividualGoalsTrackingServices";
import getIndividualMedicationSupervisoryReview from "@individual/controllers/medications/getIndividualMedicationSupervisoryReviews";
import patchIndividualMedicationSupervisoryReview from "@individual/controllers/medications/patchIndividualMedicationSupervisoryReview";
import patchDiscontinueMedication from "@individual/controllers/medications/patchDiscontinueMedication";
import postPRNMedicationToIndividual from "@individual/controllers/medications/postPRNMedicationToIndividual";
import addDailyLivingActivityService from "@individual/controllers/services/daily-living-activity/addDailyLivingActivityService";
import fetchIndividualDailyLivingActivityServices from "@individual/controllers/services/daily-living-activity/fetchIndividualDailyLivingActivityServices";
import fetchIndividualAssessments from "@individual/controllers/assessments/fetchIndividualAssessments";
import addBehaviorService from "@individual/controllers/services/behavior-management/addBehaviorService";
import fetchIndividualBehaviorManagementServices from "@individual/controllers/services/behavior-management/fetchIndividualBehaviorManagementServices";
import addChoreService from "@individual/controllers/services/chores/addChoreService";
import fetchIndividualChoreServices from "@individual/controllers/services/chores/fetchIndividualChoreServices";
import fetchIndividualDocuments from "@individual/controllers/documents/fetchIndividualDocuments";
import uploadIndividualDocument from "@individual/controllers/documents/uploadStaffDocument/uploadIndividualDocument";
import addAssessmentToIndividual from "@individual/controllers/assessments/addAssessmentToIndividual";
import updateIndividualProfile from "@individual/controllers/updateIndividualProfile";
import fetchIndividuals from "@individual/controllers/fetchIndividuals";
import getTasksByIndividualId from "@individual/controllers/tasks/fetchIndividualTasks";
import updateTaskById from "@individual/controllers/tasks/updateIndividualTask";
import updateIndividualServices from "@individual/controllers/services/updateIndividualServices";

const individualRouter = Router();

individualRouter.post("/", validateToken, registerIndividual);
individualRouter.get("/profile/:individualId", fetchIndividualProfile);
individualRouter.patch(
  "/profile/:individualId",
  validateToken,
  updateIndividualProfile
);
individualRouter.get("/get-all-individuals", fetchIndividuals);

individualRouter.get(
  "/:individualId/documents/:pageNumber",
  validateToken,
  fetchIndividualDocuments
);
individualRouter.post(
  "/:individualId/documents",
  validateToken,
  uploadFile("single", "individualDocFile"),
  uploadIndividualDocument
);

individualRouter.post(
  "/:individualId/medications/prn-medication",
  validateToken,
  postPRNMedicationToIndividual
);
individualRouter.get(
  "/:individualId/medications/:medicationId/supervisory-medication-review/:pageNumber",
  validateToken,
  getIndividualMedicationSupervisoryReview
);
individualRouter.patch(
  "/:individualId/medications/supervisory-medication-review",
  validateToken,
  patchIndividualMedicationSupervisoryReview
);
individualRouter.patch(
  "/:individualId/medications/toggle",
  validateToken,
  patchDiscontinueMedication
);
individualRouter.post(
  "/:individualId/medications",
  validateToken,
  postMedicationToIndividual
);
individualRouter.get(
  "/:individualId/medications/:pageNumber",
  validateToken,
  getIndividualMedications
);

/**
 * @swagger
 * /api/v1/individuals/{individualId}/assessments:
 *   post:
 *     summary: Add assessment to individual
 *     description: Add an assessment to an individual.
 *     tags:
 *       - Individual Assessments
 *     parameters:
 *       - in: path
 *         name: individualId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the individual to add the assessment to.
 *       - in: body
 *         name: assessment
 *         description: The assessment to add.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             category:
 *               type: string
 *               description: The type of the assessment
 *             questions:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   question:
 *                     type: string
 *                     description: The question for the assessment.
 *                   category:
 *                     type: string
 *                     description: Optional. Only needed if the question is under a section category e.g. HRST log Functional, behavioral issues
 *                   replyType:
 *                     type: string
 *                     enum: [YES_NO, STRING, NUMBER, INCIDENT_REPORT, MULTIPLE_ANSWERS]
 *                     description: The type of reply expected for the question. Can be YES_NO, STRING, NUMBER, INCIDENT_REPORT, or MULTIPLE_ANSWERS.
 *                   answer:
 *                     type: string
 *     responses:
 *       200:
 *         description: Assessment added successfully.
 *       400:
 *         description: Invalid request body (type mismatch for reply type and answer).
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Individual not found.
 *       500:
 *         description: Internal server error.
 */

individualRouter.post(
  "/:individualId/assessments",
  validateToken,
  addAssessmentToIndividual
);

/**
 * @swagger
 * /api/v1/individuals/{individualId}/assessments/{pageNumber}:
 *   get:
 *     summary: Get individual assessments
 *     description: Retrieve assessments for a specific individual.
 *     tags:
 *       - Individual Assessments
 *     parameters:
 *       - in: path
 *         name: individualId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the individual to retrieve assessments for.
 *       - in: path
 *         name: pageNumber
 *         schema:
 *           type: integer
 *         required: true
 *         description: The page number of the assessments to retrieve.
 *     responses:
 *       200:
 *         description: Individual assessments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   description: The status code of the response.
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the operation.
 *                 data:
 *                   type: object
 *                   properties:
 *                     individualAssessments:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           description: The current page number of the assessments.
 *                         totalPages:
 *                           type: integer
 *                           description: The total number of pages of assessments.
 *                         list:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               individualId:
 *                                 type: integer
 *                                 description: The ID of the individual.
 *                               assessmentId:
 *                                 type: string
 *                                 description: The ID of the assessment.
 *                               category:
 *                                 type: string
 *                                 description: The category of the assessment.
 *                               questionCount:
 *                                 type: integer
 *                                 description: The number of questions in the assessment.
 *       400:
 *         description: Invalid request parameters.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Individual not found.
 *       500:
 *         description: Internal server error.
 */

individualRouter.get(
  "/:individualId/assessments/:pageNumber",
  validateToken,
  fetchIndividualAssessments
);

individualRouter.get(
  "/:individualId/tasks/:pageNumber",
  validateToken,
  getTasksByIndividualId
);

individualRouter.patch(
  "/:individualId/task/:taskId",
  validateToken,
  updateTaskById
);

individualRouter.get(
  "/:individualId/services/chore/:pageNumber",
  validateToken,
  fetchIndividualChoreServices
);
individualRouter.post(
  "/:individualId/services/chore",
  validateToken,
  addChoreService
);
individualRouter.get(
  "/:individualId/services/behavior-management/:pageNumber",
  validateToken,
  fetchIndividualBehaviorManagementServices
);
individualRouter.post(
  "/:individualId/services/behavior-management",
  validateToken,
  addBehaviorService
);
individualRouter.get(
  "/:individualId/services/daily-living-activity/:pageNumber",
  validateToken,
  fetchIndividualDailyLivingActivityServices
);
individualRouter.post(
  "/:individualId/services/daily-living-activity",
  validateToken,
  addDailyLivingActivityService
);
individualRouter.get(
  "/:individualId/services/goal-tracking/:pageNumber",
  validateToken,
  fetchIndividualGoalsTrackingServices
);
individualRouter.post(
  "/:individualId/services/goal-tracking",
  validateToken,
  addGoalTrackingService
);
individualRouter.get(
  "/:individualId/services",
  // validateToken,
  fetchIndividualServices
);
individualRouter.post(
  "/:individualId/services",
  validateToken,
  assignIndividualServices
);
individualRouter.patch(
  "/:individualId/services/:serviceId",
  // validateToken,
  updateIndividualServices
);



export default individualRouter;
