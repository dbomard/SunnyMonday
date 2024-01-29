class Holiday {

    #startingDate;
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