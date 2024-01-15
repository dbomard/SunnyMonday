import "../dateUtils.js"
import { Day } from "./day.js"

export class Week {

    #days;
    #holidayWeek;

    constructor(dates, holidayWeek = false) {
        this.#holidayWeek = holidayWeek;
        this.#days = new Map();
        this.updateWeek(dates);
    }

    updateWeek(dates) {
        for (let date of dates) {
            let day = new Day(date);
            let index = "sunday";
            switch (date.getDay()) {
                case 1:
                    index = "monday";
                    break;
                case 2:
                    index = "tuesday";
                    break;
                case 3:
                    index = "wednesday";
                    break;
                case 4:
                    index = "thursday";
                    break;
                case 5:
                    index = "friday";
                    break;
                case 6:
                    index = "saturday";
                    break;
            }
            this.#days.set(index, day);
        }
    }

    /**
     * @param {boolean} status true=>Semaine de vacances
     */
    set holidayWeek(status) {
        this.#holidayWeek = status;
    }
}