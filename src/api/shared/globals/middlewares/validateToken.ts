import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { sendFailureResponse } from "../server/serverResponse";
import { NotAuthorizedError } from "../server/Error";
import { getAuthUserByAuthAccessToken } from "../../services/db/auth.service";
// import { parse } from 'cookie';

export default function validateToken (req:Request, res:Response, next:NextFunction) {
    let token:string =  req.headers.cookie ?? req.headers.authorization!;
    //  console.log(token, !token || !token.includes('sid'),'authorization ', req.headers.authorization!,'parseCookie ',parse(req.headers.cookie || ''))
    
    if(!token || !token.includes('sid')) {
        const nonAuthorizedError = new NotAuthorizedError('Unauthorized')
        return sendFailureResponse({
            res, 
            statusCode: nonAuthorizedError.statusCode, 
            message: nonAuthorizedError.message
        });
    }

    const allCookies = token.toString().split(';');
    const tokenCookie = allCookies?.filter(cookie => {
        console.log('cookie', cookie)
        return cookie.includes('sid')
    });

    token = tokenCookie[0]?.split('=')[1];
    console.log('token ', token)

    
    verify(token, process.env.JWT_KEY!, (error:any, decodedToken:any)=> {
        if(error) {
            console.log(error)
            const unauthorizedError = new NotAuthorizedError('There was an error')
            return sendFailureResponse({ res, statusCode: unauthorizedError.statusCode, message: unauthorizedError.message });
        }

        getAuthUserByAuthAccessToken(decodedToken.id, token!)
        .then((foundUser)=> {
            if(!foundUser) {
                const nonAuthorizedError = new NotAuthorizedError('Unauthorized')
                return sendFailureResponse({
                    res, 
                    statusCode: nonAuthorizedError.statusCode, 
                    message: nonAuthorizedError.message
                });
            }
            
            req.currentUser = {
                id: foundUser.id,
                staffObjectId: foundUser.staffObjectId,
            staffId: foundUser.staffId,
                email: foundUser.email,
                firstname: foundUser.firstname
            }

            next();
        })
        .catch((error)=> {
            console.log(error)
            const nonAuthorizedError = new NotAuthorizedError('Unauthorized')
            return sendFailureResponse({
                res, 
                statusCode: nonAuthorizedError.statusCode, 
                message: nonAuthorizedError.message
            });
        })
    })
}






// import { Request, Response, NextFunction } from "express";
// import { verify } from "jsonwebtoken";
// import { sendFailureResponse } from "../server/serverResponse";
// import { NotAuthorizedError } from "../server/Error";
// import { getAuthUserByAuthAccessToken } from "../../services/db/auth.service";

// export default function validateToken(req:Request,res:Response,next:NextFunction){
//     let token:string | undefined;

//     if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){
//         token = req.headers.authorization.split(' ')[1]
//     }else if(req.headers.cookie && req.headers.cookie.startsWith('sid')){
//         const allCookies = req.headers.cookie.split(';')
//         const tokenCookie = allCookies.filter(cookie => cookie.includes('sid'))
//         token = tokenCookie.toString().split('=')[1]
        
//     }

//     if(!token) {
//         const nonAuthorizedError = new NotAuthorizedError('Unauthorized')
//         return sendFailureResponse({
//             res,
//             statusCode:nonAuthorizedError.statusCode,
//             message:nonAuthorizedError.message
//         })
//     }

//     verify(token,process.env.JWT_KEY!, (error:any,decodedToken:any) => {
//         if(error) {
//             const unauthorizedError = new NotAuthorizedError('There')
//             return sendFailureResponse({
//                 res,
//                 statusCode:unauthorizedError.statusCode,
//                 message:unauthorizedError.message
//             })
//         }

//         getAuthUserByAuthAccessToken(decodedToken.id, token!)
//         .then((foundUser) => {
//             if(!foundUser) {
//                 const nonAuthorizedError = new NotAuthorizedError('Unauthorized')
//                 return sendFailureResponse({
//                     res,
//                     statusCode:nonAuthorizedError.statusCode,
//                     message:nonAuthorizedError.message
//                 })
//             }

//             req.currentUser={
//                 id:foundUser.id,
//                 staffObjectId:foundUser.staffObjectId,
//                 staffId:foundUser.staffId,
//                 email:foundUser.email,
//                 firstname:foundUser.firstname
//             }

//             next()
//         })
//         .catch((error) => {
//             console.log(error)
//             const nonAuthorizedError = new NotAuthorizedError('Unauthorized');
//                 return sendFailureResponse({
//                 res,
//                 statusCode: nonAuthorizedError.statusCode,
//                 message: nonAuthorizedError.message
//             });
//         })
//     })
// }


