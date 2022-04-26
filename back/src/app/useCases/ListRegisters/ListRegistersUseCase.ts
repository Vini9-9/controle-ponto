import { inject, injectable } from "tsyringe";
import { Register } from "../../models/entity/Register";
import { IRegistersRepository } from "../../repositories/IRegistersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import moment = require("moment");
import { AppError } from "../../errors/AppError";

interface IRequestPeriod {
    userId: string;
    startDate: string;
    endDate: string;
}

interface IRequestToday {
    userId: string;
    startDate: string;
}


@injectable()
export class ListRegistersUseCase {

    constructor(
        @inject("RegistersRepository")
        private registersRepository: IRegistersRepository,
        
    ) {}

    addMinutesWorked(resultDto: object[]): object[] {
        var periodMinutesWorked = 0
        const limitHours = 8
        
        resultDto.forEach((el) => {
            var elZero = el[0]
            periodMinutesWorked = elZero.minutesWorked + periodMinutesWorked
        })
        
        const overworked = periodMinutesWorked > 60 * limitHours 
         
        const hours = Math.floor((periodMinutesWorked/60))
        const minutes = periodMinutesWorked % 60

        const periodHoursWorked =  `${hours}:${minutes < 10 ? '0' + minutes : minutes}`

        resultDto.push({ periodHoursWorked , overworked })
        return resultDto
    }

    formatList(result: object[]): object[] {
        let dates = Object.keys(result)
        let registers = Object.values(result)
        
        let resultDto = []

        registers.forEach((el,idx) => {
            resultDto.push([{
                date: dates[idx],
                registers: registers[idx],
                minutesWorked: el["minutesWorked"]
            }])
        })
        return resultDto
    }

    async periodTimeSheet ({userId, startDate, endDate}: IRequestPeriod): Promise<AppError | object[]>{

        const list = await this.registersRepository.listBetweenDates({userId, startDate, endDate});
        
        const hasRegisters = list.length;

        if(!hasRegisters){
            return new AppError("user has no registers");
        }

        const listDatesFormatted = formatDates(list)

        const listPerDay = separatePerDay(listDatesFormatted)
        
        const listDto = addType(listPerDay)

        return listDto;
    }
     
}

function separatePerDay(list: Register[]){

    const result = groupBy(list, "date");
    return result
}

function groupBy (array, key) {
	return array.reduce((acc, item) => {
    	if (!acc[item[key]]) acc[item[key]] = []
        acc[item[key]].push(item)
        return acc
    }, {})
}

function formatDates(list: Register[]) {
    list.forEach((el) => {

        const dateStr = el.date.toString()
        const dateBR = moment(dateStr, 'ddd MMM DD YYYY').format('DD/MM/YYYY') // 26/04/2022
        el.date = dateBR
    })

    return list
}

function addType(listPerDay: any):object[] {

    const valuesGrand = Object.values(listPerDay)

    valuesGrand.forEach((el) => {
        let valuesParent = Object.values(el)
        el["minutesWorked"] = 0
        //console.log("elGrand:", typeof el, el)
        for (let index = 0; index < valuesParent.length; index++) {
            const element = valuesParent[index];
            let valuesChild = Object.values(element)

            if(index%2 != 0){
                const elementBef = valuesParent[index-1]
                
                var momTimeBef = moment(elementBef.time, 'HH:mm:ss')
                var momTimeCur = moment(element.time, 'HH:mm:ss')
 
                const diffMinutes = momTimeCur.diff(momTimeBef,'m')
                const hoursWorked = momTimeCur.diff(momTimeBef,'h')

                const minutesWorked = diffMinutes < 60 ? diffMinutes : diffMinutes - (hoursWorked * 60);

                el["minutesWorked"] = diffMinutes +  el["minutesWorked"]
            }

            element.type = index%2 == 0 ? 'in' : 'out';
            delete element.id
            delete element.userId
        }

    })
    return listPerDay
}

