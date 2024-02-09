export class Color {

    #red;
    #green;
    #blue;

    /**
     * @param {string} valueHex 
     */
    constructor(valueHex) {
        this.#red = parseInt(valueHex.substring(1, 3), 16);
        this.#green = parseInt(valueHex.substring(3, 5), 16);
        this.#blue = parseInt(valueHex.substring(5), 16);
    }

    /**
     * @returns {string} Hex representation of the color
     */
    getColor() {
        return "#" + this.#red.toString(16) + this.#green.toString(16) + this.#blue.toString(16);
    }
}