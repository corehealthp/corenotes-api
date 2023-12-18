import { Router } from "express";
import fetchStaffProfile from "../controllers/fetchStaffProfile";
import fetchStaffDocuments from "../controllers/documents/fetchStaffDocuments";
import uploadStaffDocument from "../controllers/documents/uploadStaffDocument/uploadStaffDocument";
import resetStaffPassword from "../controllers/security/resetStaffPassword";
import validateToken from "../../../shared/globals/middlewares/validateToken";
import uploadFile from "../../../shared/globals/middlewares/uploadFile";
import fetchStaffs from "../controllers/fetchStaffs";
import deactivateStaff from "../controllers/security/deactivateStaff";
import activateStaff from "../controllers/security/activateStaff";
import fetchStaffActivities from "../controllers/activities/fetchStaffActivities";
import register from "../controllers/register/register";
import createStaffRole from "../controllers/roles/createStaffRole";
import fetchStaffRoles from "../controllers/roles/fetchStaffRoles";
import fetchStaffRolesDetails from "@staff/controllers/roles/fetchStaffRoleDetails";
import updateStaffProfile from "@staff/controllers/updateStaffProfile";
import postNewShift from "@staff/controllers/shifts/postNewShift";
import getStaffShifts from "@staff/controllers/shifts/getStaffShifts";
import getClockIn from "@staff/controllers/shifts/getClockIn";
import getClockOut from "@staff/controllers/shifts/getClockOut";
import deactivateStaffProfile from "@staff/controllers/deactivateStaffProfile";
import activateStaffProfile from "@staff/controllers/activateStaffProfile";
import DeleteStaffDocument from "@staff/controllers/documents/deleteStaffDocument";

const staffRouter = Router();

staffRouter.post('/register', validateToken, register)

staffRouter.post('/clock-out', validateToken, getClockOut);
staffRouter.post('/clock-in', validateToken, getClockIn);

staffRouter.post('/:staffId/shifts', validateToken, postNewShift);
staffRouter.get('/:staffId/shifts/:pageNumber', validateToken, getStaffShifts);

staffRouter.patch('/update', validateToken, updateStaffProfile)

staffRouter.get('/roles/details/:roleId', validateToken, fetchStaffRolesDetails)
staffRouter.post('/roles', validateToken, createStaffRole)
staffRouter.get('/roles/:pageNumber', validateToken, fetchStaffRoles)

staffRouter.get('/profile/:staffId', validateToken, fetchStaffProfile)
staffRouter.put('/profile/deactivate/:staffId', validateToken,deactivateStaffProfile)
staffRouter.put('/profile/activate/:staffId', validateToken,activateStaffProfile)

staffRouter.get('/:staffId/documents/:pageNumber', validateToken, fetchStaffDocuments)
staffRouter.post('/:staffId/documents', validateToken, uploadFile('single', 'staffDocFile'), uploadStaffDocument)
staffRouter.delete('/:staffId/:documentId',validateToken,  DeleteStaffDocument) //For the delete staff document

staffRouter.post('/:staffId/password-reset', validateToken, resetStaffPassword)
staffRouter.post('/:staffId/deactivate', validateToken, deactivateStaff)
staffRouter.post('/:staffId/activate', validateToken, activateStaff)

staffRouter.post('/:staffId/activities/:pageNumber', fetchStaffActivities)

staffRouter.get('/:pageNumber', fetchStaffs)


export default staffRouter;