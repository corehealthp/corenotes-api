import { Types } from "mongoose";
import getServiceByRefName from "src/api/features/services/services/db/getServiceByRefName";

export interface IIMakeBloodGlucoseCheckTaskDets {
    individualId:string;
    bloodGlucoseCheck:boolean;
    schedule: {
        startDate: string;
        frequency: string;
        frequencyAttr: number;
        time: string;
    };
}

export default function makeBloodGlucoseCheckTask(bloodGlucoseCheckDets:IIMakeBloodGlucoseCheckTaskDets) {
    return new Promise(async (resolve, reject)=> {
        const newTaskObjectId = new Types.ObjectId();

        const service = await getServiceByRefName("blood-glucose-check");

        const splitDate = bloodGlucoseCheckDets.schedule.startDate.split('-'),
        year = parseInt(splitDate[0]), month= parseInt(splitDate[1]) - 1, date = parseInt(splitDate[2]),

        splitTime = bloodGlucoseCheckDets.schedule.time.split(':'),
        hour = parseInt(splitTime[0]), minutes = parseInt(splitTime[1]);

        const startDateTimeFormat = new Date(year, month, date, hour, minutes);
        const g = startDateTimeFormat.getTime() +  (2 * 60 * 60 * 1000);
        const endDateTimeFormat = new Date(g);
    
        resolve(Object.freeze({
            _id: newTaskObjectId,
            taskType: service?.refName,
            serviceId: service?._id.toString(),
            individualId: bloodGlucoseCheckDets.individualId,
            bloodGlucoseCheck: bloodGlucoseCheckDets.bloodGlucoseCheck,
            schedule:{
                startAt: startDateTimeFormat,
                endAt: endDateTimeFormat,
            },
        }))
    })
}