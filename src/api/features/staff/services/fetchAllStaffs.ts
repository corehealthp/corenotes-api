import { getStaffRoleById } from "src/api/shared/services/db/staff.service";
import staffModel from "@staff/model/staff.model";
import { IStaffDocument } from "@staff/model/types";

interface IFetchStaffResponse {
    currentPage:number, 
    totalPages:number,
    staffs:staffList[],
    total:number;
}

interface staffList {
    id:string;
    staffId:number;
    profileImage:string; 
    firstname:string; 
    lastname:string; 
    dob:string; 
    role:string;
    gender:string; 
    phoneNumber:string;
    lastSeen:Date;
}


export default function fetchAllStaffs(pageNumber:number) {
    return new Promise<IFetchStaffResponse>(async (resolve, reject)=> {
        const   queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        const query = { active: true };

        staffModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundStaffs:IStaffDocument[])=> {    

            const mappedStaffs:Array<staffList>  = [];

            for await ( const staff of foundStaffs ) {
                await getStaffRoleById(staff.providerRole)
                .then((foundRole)=> {
                    mappedStaffs.push({
                        id: staff._id.toString(),
                        staffId: staff.staffId,
                        profileImage: staff.profileImage,
                        firstname: staff.firstname,
                        lastname: staff?.lastname ?? "nill",
                        dob: staff.dob,
                        role: foundRole ? foundRole.title.toUpperCase() :"nill",
                        phoneNumber: staff.phoneNumber.work,
                        gender: staff.gender,
                        lastSeen: staff.lastSeen
                    })
                })
                .catch((error)=> {
                    console.log("There was an error getting staff role", error);
                    mappedStaffs.push({
                        id: staff._id.toString(),
                        staffId: staff.staffId,
                        profileImage: staff.profileImage,
                        firstname: staff.firstname,
                        lastname: staff?.lastname ?? "nill",
                        dob: staff.dob,
                        role: "nill",
                        phoneNumber: staff.phoneNumber.work,
                        gender: staff.gender,
                        lastSeen: staff.lastSeen
                    })
                })
            }

            staffModel.count()
            .then((totalStaffCount)=> {
                
                const totalPageNumber = Math.ceil(totalStaffCount / resultsPerPage);

                resolve({
                    currentPage: pageNumber, 
                    totalPages: totalPageNumber,
                    staffs: mappedStaffs,
                    total: totalStaffCount
                })
            })
            .catch((error)=> reject(error))
        })
        .catch((error)=> {
            console.log(error)
            reject(error)
        })
    });
}