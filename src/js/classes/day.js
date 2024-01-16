export class Day {

    #date;
    #workingDay;

    constructor(date) {
        this.#date = date;
        this.#workingDay = true;
    }

    /**
     * @param {boolean} status true=>Jour travaillé
     */
    set workingDay(status) {
        this.#workingDay = status;
    }

    get workingDay() {
        return this.#workingDay;
    }

    /**
     * @returns {Date}  Date du jour
     */
    get date() {
        return this.#date;
    }
}