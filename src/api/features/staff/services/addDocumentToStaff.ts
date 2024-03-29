import { INewDocument } from "@staff/controllers/documents/uploadStaffDocument/validateUploadStaffDocument";
import staffModel from "@staff/model/staff.model";
import { IStaffDocument } from "@staff/model/types";

export default function addDocumentToStaff(
  staffId: string,
  document: INewDocument
) {
  return new Promise((resolve, reject) => {
    const query = { staffId: staffId };
    const updateObj = { $push: { documents: document } };

    staffModel
      .findOneAndUpdate(query, updateObj, { new: true })
      .then((updatedStaff: IStaffDocument) => resolve(updatedStaff))
      .catch((error) => {
        console.log("====================================");
        console.log("ADD_STAFF_ERROR", error);
        console.log("====================================");
        reject(error);
      });
  });
}
