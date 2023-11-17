import { sendFailureResponse } from "@globals/server/serverResponse"
import validateImageFile from "@services/fileSystem/validateImageFile"
import { NextFunction, Request, Response } from "express"
import multer from "multer"

interface UploadFileType {
    fileAmount:'single'|'multiple'|'fields',
    fieldName:string,
    fieldProperties:{
        name: string,
        maxCount: number
    }[]
}

export interface FileType {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    buffer: Buffer,
    size: number
}

export interface RequestFileType extends Express.Multer.File {
    type?: string
}

const MAX_FILE_SIZE:number = parseFloat(process.env.IMAGE_FILE_SIZE!);
const MAX_FILE_SIZE_CAT:string = process.env.IMAGE_FILE_SIZE_CAT!;

let maxFileSize:number = 0;

if(MAX_FILE_SIZE_CAT === 'MB') {
    // convert MB to Bytes
    maxFileSize = parseFloat((MAX_FILE_SIZE * 1000000).toString());
    console.log(maxFileSize);
}

let uploadError:string = '';

export default function uploadFile(fileAmount:UploadFileType['fileAmount'], fieldName:UploadFileType['fieldName'], fieldProperties?:UploadFileType['fieldProperties'], folder?:string) {
    return (req:Request, res:Response, next:NextFunction)=> {
        const upload = multer({ 
            dest: 'public/',
            limits: { fileSize:  parseFloat(((MAX_FILE_SIZE  * 1000000) ?? (10000000)).toString()) }
        })

        let totalFiles = 0,
        filesUploaded = 0;

        let file:Function = upload.any();

        let isFileError:boolean = false;
        
        if(!uploadError) {

            if(fileAmount === 'single') file = upload.single(fieldName)
            
            if(fileAmount === 'multiple') {
                file = upload.array(fieldName)
            }
            
            if(fileAmount === 'fields') {
                file = upload.fields(fieldProperties!)
            }
        }

        return file(req, res, async (error:any) => {
            // if(uploadError) {
            //     return sendFailureResponse({res, 417, uploadError); 
            // }
            // else {
                if(req.files?.length || req.files!) {
                    let allFiles:any = []
                    
                    if(fileAmount === 'fields') {
                        const fileMultiArray = Object.values(req.files!);

                        totalFiles = fileMultiArray.length
                        
                        fileMultiArray.forEach(fileArray => {
                            allFiles.push(fileArray[0])
                        })

                    } else {
                        allFiles = req.files;
                        totalFiles = allFiles.length
                    }
                    
                    try {
                        for await (file of allFiles) {
                            validateImageFile(file)
                            .catch((error)=> {
                                console.log(error)
                            })
                            .finally(()=> ++filesUploaded)
                        }
                    }
                    catch (error:any) {
                        // Using try catch block because error handling in loop doesn't quit the loop
                        isFileError = true;
                        console.log('Error sending messasge')
                        return sendFailureResponse({res, statusCode: 417, message: "Error uploading file"})
                    }
                }

                if(req.file) {
                    totalFiles = 1;
                    ++filesUploaded
                    await validateImageFile(req.file)
                    .catch((error)=> {
                        isFileError = true;
                        return sendFailureResponse({res, statusCode: 417, message: error})
                    })
                }

                if(error?.code === 'LIMIT_FILE_SIZE') {
                    uploadError = `File size should not be larger than ${MAX_FILE_SIZE}${MAX_FILE_SIZE_CAT}. Please replace any image higher.`;
                    console.log('ERROR UPLOADING IMAGES, FILE SIZE LIMIT')
                    return sendFailureResponse({res, statusCode: 417, message: uploadError})
                }

                if(error) {
                    isFileError = true;
                    uploadError = 'Invalid image file please select another file and try again.'
                    console.log('ERROR UPLOADING IMAGES, INVALID IMAGE FILE')
                    console.log(error)
                    return sendFailureResponse({res, statusCode: 417, message: 'Invalid image file please select another file and try again.'})
                }
                
                if(!isFileError && !uploadError) {
                    if(totalFiles === filesUploaded) next()
                } else {
                    console.log('ERROR UPLOADING IMAGES', uploadError)
                    return sendFailureResponse({res, statusCode: 417, message: "There was an error uploading your images, try again."})
                }
            // }
        })
    }
}