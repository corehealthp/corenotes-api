import { NotFoundError } from "@globals/server/Error";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service";
import { IndividualAssessmentModel } from "@individual/models/individual-assessment.model";

interface IIndividualAssessmentResponse {
  currentPage: number;
  totalPages: number;
  list: IMappedAssessment[];
}

interface IMappedAssessment {
  individualId: number;
  assessmentId: string;
  category: string;
  questionCount: number;
}

export default function getAssessmentsByIndividualId(
  individualId: string,
  pageNumber: number
) {
  return new Promise<IIndividualAssessmentResponse>((resolve, reject) => {
    getIndividualByIndividualId(individualId)
      .then((foundIndividual) => {
        if (!foundIndividual) {
          const notFoundError = new NotFoundError(
            "Individual has not been assigned any assessments"
          );
          reject(notFoundError);
        }

        const query = { individualId: parseInt(individualId) };

        const queryPageNumber = pageNumber - 1 ?? 0,
          resultsPerPage = 10,
          pageOffset = resultsPerPage * queryPageNumber;

        IndividualAssessmentModel.find(query)
          .skip(pageOffset)
          .limit(resultsPerPage)
          // .sort({ createdAt: -1 })
          .then(async (foundAssessments) => {
            const mappedAssessments: IMappedAssessment[] = [];

            for (const assessment of foundAssessments) {
              mappedAssessments.push({
                individualId: assessment.individualId,
                assessmentId: assessment._id.toString(),
                category: assessment.category,
                questionCount: assessment.questions.length,
              });
            }

            IndividualAssessmentModel.count(query).then(
              (totalIndividualCount: number) => {
                const totalPageNumber = Math.ceil(
                  totalIndividualCount / resultsPerPage
                );

                resolve({
                  currentPage: pageNumber,
                  totalPages: totalPageNumber,
                  list: mappedAssessments,
                });
              }
            );
          })
          .catch((error) => {
            console.log(
              "There was an error retrieving assessments by individual object Id",
              error
            );
            reject(error);
          });
      })
      .catch((error) => {
        console.log(
          "There was an error finding individual assessments by individual object Id",
          error
        );
        reject(error);
      });
  });
}
