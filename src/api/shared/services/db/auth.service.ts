import { ObjectId } from "mongoose";
import { NotFoundError } from "@globals/server/Error";
import staffModel from "@staff/model/staff.model";
import { IStaffDocument } from "@staff/model/types";
import userModel from "@user/models/user.model";
import { IUserDocument } from "@user/models/types";

export function getAuthUserById(id:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        staffModel.findOne({ _id: id })
        .then((foundUser:IStaffDocument)=> resolve(foundUser))
        .catch((error)=> reject(error))
    });
}

export function getAuthUserByEmail(email:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        staffModel.findOne({email})
        .then((foundUser:IStaffDocument)=> resolve(foundUser))
        .catch((error)=> reject(error))
    });
}

export function getAuthUserByUsername(username:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        staffModel.findOne({username})
        .then((foundUser:IStaffDocument)=> resolve(foundUser))
        .catch((error)=> reject(error))
    });
}

export function getAuthUserByEmailOrUsername(data:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        const query = {
            $or: [
                { username: data.toLowerCase() },
                { email: data.toLowerCase() }
            ]
        };

        staffModel.findOne(query)
        .then((foundUser:IStaffDocument)=> resolve(foundUser))
        .catch((error)=> reject(error))
    });
}

export function getAuthUserByAuthAccessToken(userDocumentId:ObjectId, accessToken:string) {
    return new Promise<{ id:string, email:string, firstname:string }>((resolve, reject)=> {
        const query = {
            $and: [
                { _id: userDocumentId },
                { accessToken }
            ]
        };

        userModel.findOne(query)
        .then((foundUser:IUserDocument)=> {
            if(!foundUser) {
                const notFoundError = new NotFoundError('User not found');
                reject(notFoundError);
            }

            staffModel.findOne({ _id: foundUser.staff })
            .then((foundStaff)=> {
                if(!foundStaff) {
                    const notFoundError = new NotFoundError('Staff not found');
                    reject(notFoundError);
                }

                resolve({ 
                    id: foundUser.id,
                    email: foundStaff.email,
                    firstname: foundStaff.firstname
                });
            })
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    })
}