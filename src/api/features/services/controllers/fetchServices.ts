import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchAllServices from "../services/fetchAllServices";
import serviceModel from "../models/service.model";

export default async function fetchServices(req:Request, res:Response) {
    //  fetchAllServices(parseInt(req.params.pageNumber) ?? 1)
    // .then((paginatedServices)=> {
    //     sendSuccessResponse({
    //         res,
    //         statusCode: 200,
    //         message:"Services retrieved successfully",
    //         data: paginatedServices
    //     });
    // })
    // .catch((error)=> {
    //     console.log('There was an error fetching all services')
    //     console.log(error)
    //     sendFailureResponse({ res, statusCode: 500, message: "There was a server error, not your fault, we're on it"});
    // })
    try {
        const fetchStaff = await serviceModel.find().sort({ createdAt: -1 });
        res.status(200).json(fetchStaff);
      } catch (err) {
        res.status(500).json(err);
      }
}