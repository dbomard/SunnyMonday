import "./dateExtras.js";

export class Year {
  #year;
  #weeks;

  constructor() {
    let date = new Date();
    this.#year = date.getFullYear();
    this.#updateWeekNumbers();
  }

  #updateWeekNumbers() {
    let date = new Date(this.#year, 11, 28);
    this.#weeks = date.getWeek();
    console.log(`${this.#weeks} semaines dans l'année ${this.#year}`);
  }

  get year() {
    return this.#year;
  }

  set year(newYear) {
    console.log(`Année changée\n`);
    this.#year = newYear;
    this.#updateWeekNumbers();
  }

  get weeks() {
    return $this.this.#weeks;
  }
}
