import "../dateUtils.js";

export class Team {
  #name;
  #color;
  #pattern;

  /**
   *
   * @param {string} name
   * @param {Array} weeksPattern
   * @param {string} color 
   */
  constructor(name, weeksPattern, color = "#cfcfcf") {
    this.#name = name;
    this.#pattern = weeksPattern;
    this.#color = color;
  }

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }
}
