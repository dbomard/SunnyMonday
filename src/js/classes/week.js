import "../dateUtils"
import { Day } from "./day"

export class Week {

    #days;
    #holidayWeek;

    constructor(starting_date, holidayWeek = false) {
        this.#holidayWeek = holidayWeek;
        this.#days = new Map();
        this.updateWeek(starting_date);
    }

    updateWeek(starting_date) {
        for (let i = 0; i < 7; i++) {
            const day = new Day(starting_date.add(i));
            if (day.date.getDay() === 0)
                this.#days.set(i + 1, new Day(starting_date.add(i)));
        }
    }

    /**
     * @param {boolean} status true=>Semaine de vacances
     */
    set holidayWeek(status) {
        this.#holidayWeek = status;
    }
}