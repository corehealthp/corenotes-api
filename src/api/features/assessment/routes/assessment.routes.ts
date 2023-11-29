import { Router } from "express";
import fetchAssessments from "../controllers/fetchAssessments";
import fetchAssessmentCategories from "../controllers/fetchAssessmentCategories";
import createQuestionCategory from "../controllers/createQuestionCategory";
import createAssessmentCategory from "../controllers/createAssessmentCategory";
import fetchAssessmentDetails from "@assessment/controllers/fetchAssessment";
import validateToken from "@globals/middlewares/validateToken";
import uploadFile from "@globals/middlewares/uploadFile";
import { createAssessmentsFromCSV } from "@assessment/controllers/createAssessment/createAssessmentsFromCSV";
import postCreateAssessment from "../controllers/createAssessment/postCreateAssessment";

const assessmentRouter = Router();

assessmentRouter.post('/upload-with-csv', uploadFile("single", "assessmentCSV"), createAssessmentsFromCSV)

assessmentRouter.get('/categories', fetchAssessmentCategories)
assessmentRouter.post('/assessment-categories', createAssessmentCategory)
assessmentRouter.post('/question-categories', createQuestionCategory)

assessmentRouter.get('/details/:assessmentId', fetchAssessmentDetails)
// assessmentRouter.get('/:individualId/:pageNumber', fetchIndividualAssessments)
assessmentRouter.get('/:pageNumber', fetchAssessments)
assessmentRouter.post('/', validateToken, postCreateAssessment)

export default assessmentRouter;