export class Holiday {

    /**@type {Date} */
    #startingDate;
    /**@type {Date} */
    #endingDate;
    #name;

    /**
     * 
     * @param {string} name 
     * @param {Date} startingDate 
     * @param {Date} endingDate 
     */
    constructor(name, startingDate, endingDate) {
        this.#name = name;
        this.startingDate = startingDate;
        this.endingDate = endingDate;
    }

    /**
     * @returns {integer} Number of weeks
     */
    duration() {
        let oneWeek = 604800000; // nombre de millisecondes en 1 semaine = 7j * 24h *60min * 60s * 1000ms
        let duration = Math.floor(this.endingDate.getTime() - this.startingDate.getTime() / oneWeek);
        return duration;
    }

    

    get name() {
        return this.#name;
    }
    set name(name) {
        if (!name instanceof string) {
            throw new TypeError();
        }
        this.#name = name;
    }
    get startingDate() {
        return this.#startingDate;
    }
    set startingDate(date) {
        if (!date instanceof Date) {
            throw new TypeError();
        }
        this.#startingDate = date;
    }
    get endingDate() {
        return this.#endingDate;
    }
    set endingDate(date) {
        if (!date instanceof Date) {
            throw new TypeError();
        }
        this.#endingDate = date;
    }
}