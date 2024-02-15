import staffModel from "@staff/model/staff.model";

// export default  function updateStaffProfileByStaffId(staffId:string, updateProps:object) {
//     return new Promise(async (resolve, reject)=> {
//         const updateObj = { $set: updateProps }
//         await staffModel.findByIdAndUpdate(
//             staffId,
//             { $set: updateObj },
//             { new: true }
//           ).then((updatedStaff)=> resolve(updatedStaff))
//           .catch((error)=> reject(error))
//     })

   
// }


// export default function updateStaffProfileByStaffId(staffId: string, updateProps: object) {
//     return new Promise((resolve, reject) => {
//         const updateObj = { $set: updateProps };

//         // Use findByIdAndUpdate to find and update the staff profile
//         staffModel.findByIdAndUpdate(staffId, updateObj, { new: true })
//             .then(updatedStaff => {
//                 if (!updatedStaff) {
//                     // If no staff is found with the given ID, handle the error
//                     return reject("No staff found with the provided ID");
//                 }
//                 // Resolve with the updated staff profile
//                 resolve(updatedStaff);
//             })
//             .catch(error => {
//                 // If any error occurs during the update process, reject the promise
//                 reject(error);
//             });
//     });
// }



export default function updateStaffProfileByStaffId(staffId: string, updateProps: any) {
    return new Promise((resolve, reject) => {
        // Check if the updateProps contain a username
        if (updateProps.hasOwnProperty('username')) {
            const newUsername = updateProps['username'];

            // Search for existing staff with the new username
            staffModel.findOne({ username: newUsername })
                .then(existingStaff => {
                    if (existingStaff && existingStaff._id.toString() !== staffId) {
                        // If a staff with the new username exists and it's not the current staff being updated
                        reject('Username already exists.');
                    } else {
                        // Proceed with the update
                        const updateObj = { $set: updateProps };
                        staffModel.findByIdAndUpdate(staffId, updateObj, { new: true })
                            .then(updatedStaff => resolve(updatedStaff))
                            .catch(error => reject(error));
                    }
                })
                .catch(error => reject(error));
        } else {
            // If the updateProps do not contain a username, proceed with the update directly
            const updateObj = { $set: updateProps };
            staffModel.findByIdAndUpdate(staffId, updateObj, { new: true })
                .then(updatedStaff => resolve(updatedStaff))
                .catch(error => reject(error));
        }
    });
}
