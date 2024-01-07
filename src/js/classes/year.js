import "./dateExtras.js";
import { weekTypes } from "./week.js";

async function downloadOffDays(year) {
  const response = await fetch(
    `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`);
  return response.text();
}

export class Year {
  #year;
  #weeksNumber;
  #workingWeeks;
  #offDays;

  constructor() {
    let date = new Date();
    this.#year = date.getFullYear();
    this.#updateOffDays();
    this.#updateWeekNumbers();
    this.#updateWorkingWeeks();
  }

  #updateWorkingWeeks() {
    //TODO : compléter méthode updateWorkingWeeks
    this.#workingWeeks = new Array(this.weeksNumber);

  }

  #updateOffDays() {
    //TODO : compléter Méthode getOffDays
    downloadOffDays(this.year)
      .then((response) => this.#offDays = JSON.parse(response))
      .then(() => console.log(`Jours fériés mis à jour:\n${JSON.stringify(this.#offDays)}`));
  }

  #updateWeekNumbers() {
    let date = new Date(this.#year, 11, 28);
    this.#weeksNumber = date.getWeek();
    console.log(`${this.#weeksNumber} semaines dans l'année ${this.#year}`);
  }

  get offDays() {
    return this.#offDays;
  }

  get year() {
    return this.#year;
  }

  set year(newYear) {
    console.log(`Année changée\n`);
    this.#year = newYear;
    this.#updateWeekNumbers();
    this.#updateOffDays();
  }

  get weeksNumber() {
    return $this.this.#weeksNumber;
  }
}
