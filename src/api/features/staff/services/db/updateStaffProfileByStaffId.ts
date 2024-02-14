import staffModel from "@staff/model/staff.model";

export default function updateStaffProfileByStaffId(
  staffId: number,
  updateProps: object
) {
  return new Promise((resolve, reject) => {
    const query = { staffId: staffId };
    const updateObj = { $set: updateProps };

    staffModel
      .findOneAndUpdate(query, updateObj, { new: true })
      .then((updatedStaff) => resolve(updatedStaff))
      .catch((error) => reject(error));
  });
}
