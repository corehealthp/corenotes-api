import { sendSuccessResponse } from "@globals/server/serverResponse";
import staffroleModel from "../../model/staffrole.model";
import formatStaffRolesForClient, { IStaffRoleForClient } from "./formatStaffRolesForClient";

interface IFetchAllStaffRolesResponse {
    currentPage:number,
    totalPages:number,
    staffRoles:Array<IStaffRoleForClient>
}

export default function fetchAllStaffRoles() {
    return new Promise<IFetchAllStaffRolesResponse>((resolve, reject)=> {

        // const   parsedPageNumber = pageNumber - 1 ?? 0,
        //     resultsPerPage = 10, 
        //     pageOffset = resultsPerPage * parsedPageNumber;

        staffroleModel.find()
        // .skip(pageOffset)
        // .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then((foundStaffRole)=> {
            formatStaffRolesForClient(foundStaffRole)
            .then((staffRolesForClient)=> {
                
                staffroleModel.count()
                .then((totalStaffCount:number)=> {

                    // const totalPageNumber = Math.ceil(totalStaffCount / resultsPerPage);
                    resolve({
                        currentPage: 1,
                        totalPages: 1,
                        staffRoles: staffRolesForClient
                    })
                })
            })
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    })
}