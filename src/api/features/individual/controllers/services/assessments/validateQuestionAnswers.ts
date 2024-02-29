import {
  IncidentReportType,
  Question,
  ReplyType,
} from "@individual/models/individual-assessment.model";

export default function validateAnswer(question: Question): void {
  switch (question.replyType) {
    case ReplyType.YES_NO:
      if (question.answer !== "YES" && question.answer !== "NO") {
        throw new Error(
          `Invalid answer for replyType ${question.replyType}. Answer must be either YES or NO`
        );
      }
      break;
    case ReplyType.STRING:
      if (typeof question.answer !== "string") {
        throw new Error(
          `Invalid answer for replyType ${question.replyType}. Answer must be a string`
        );
      }
      break;
    case ReplyType.NUMBER:
      if (
        typeof question.answer !== "number" ||
        !Number.isInteger(question.answer)
      ) {
        throw new Error(
          `Invalid answer for replyType ${question.replyType}. Answer must be an integer`
        );
      }
      break;
    case ReplyType.INCIDENT_REPORT:
      if (
        !Object.values(IncidentReportType).includes(
          question.answer as IncidentReportType
        )
      ) {
        throw new Error(
          `Invalid answer for replyType ${
            question.replyType
          }. Answer must be one of ${Object.values(IncidentReportType).join(
            ", "
          )}`
        );
      }
      break;
    case ReplyType.MULTIPLE_ANSWERS:
      if (!Array.isArray(question.answer) || question.answer.length === 0) {
        throw new Error(`Invalid answer for replyType ${question.replyType}`);
      }
      for (const ans of question.answer) {
        if (
          typeof ans !== "string" &&
          typeof ans !== "number" &&
          ans !== "YES" &&
          ans !== "NO"
        ) {
          throw new Error(
            `Invalid answer for replyType ${question.replyType}. ${ans} is expected to be a number, string, YES, or NO`
          );
        }
      }
      break;
    default:
      throw new Error(`Invalid replyType ${question.replyType}`);
  }
}
