import calcAge from "@globals/helpers/calcAge";
import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { IIndividualDocument } from "@individual/models/types";
import { getCompartmentById } from "src/api/shared/services/db/compartment.service";

export interface IFetchIndividualResponse {
  currentPage: number;
  totalPages: number;
  individuals: IIndividualListItem[];
}

export interface IIndividualListItem {
  id: string;
  individualId: string;
  profileImage: string;
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
  compartment?: string;
  medicaidNumber: string;
  medicareNo:string;
}

export default function fetchAllIndividuals() {
  return new Promise<any>((resolve, reject) => {
    
    individualModel
      .find().then(async (foundIndividuals: any[]) => {
        if (!foundIndividuals.length) {
          const notFoundError = new NotFoundError("No individuals found");
          reject(notFoundError);
        }

        const mappedIndividuals: any[] = [];

        for await (const individual of foundIndividuals) {
          let compartmentTitle = 'No Compartment';
        
          if (individual.compartment) {
            const compartmentInfo = await getCompartmentById(individual.compartment);
            if (compartmentInfo) {
              compartmentTitle = compartmentInfo.title;
            }
          }
          mappedIndividuals.push({
            id: individual._id.toString(),
            individualId: individual.individualId,
            profileImage: individual.profileImage,
            firstname: individual.firstname,
            lastname: individual.lastname,
            age: calcAge(individual.dob),
            gender: individual.gender, 
            medicaidNumber: individual.medicaidNumber,
            medicareNo: individual.medicareNo,
            compartment: compartmentTitle, // Use compartment title retrieved or default value
          });
        }
        

        individualModel.count().then((totalIndividualCount: number) => {
         

          return resolve({
            individuals: mappedIndividuals,
          });
        });
      })
      .catch((error) => {
        console.log(
          `USER FETCH ERROR: There was an error retrieving individuals. `,
          error
        );
        reject(error);
      });
  });
}
