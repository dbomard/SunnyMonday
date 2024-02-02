import "../dateUtils.js";

export class Team {
  #name;
  #color;
  #pattern;
  #days

  /**
   *
   * @param {string} name
   * @param {Array} weeksPattern
   * @param {string} color 
   * @param {Array.<date>} days 
   */
  constructor(name, weeksPattern, color = "#cfcfcf") {
    this.#name = name;
    this.#pattern = weeksPattern;
    this.#color = color;
    this.#days = new Array();
  }

  resetDays() {
    this.#days = new Array();
  }

  addDay(date, patternIndex) {
    let newDay = date.getCopy();
    this.#days.push(newDay);
  }

  get days() {
    return this.#days;
  }

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }
}
