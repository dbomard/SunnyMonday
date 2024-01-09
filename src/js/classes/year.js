import "./dateExtras.js";
import { weekTypes } from "./week.js";

async function downloadOffDays(year) {
  const response = await fetch(
    `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`
  );
  return response.text();
}

function addDays(date, days) {
  let newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days
  );
  return `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;
}

export class Year {
  #year;
  #weeksNumber;
  #workingWeeks;
  #offDays;

  constructor() {
    this.#offDays = new Map();
    let date = new Date();
    this.year = date.getFullYear();
  }

  #updateWorkingWeeks() {
    //TODO : compléter méthode updateWorkingWeeks
    this.#workingWeeks = new Array(this.weeksNumber);
  }

  #getEasterDate() {
    //TODO: calculer la date de Pâques
    let B = 19 * (this.#year % 19) + 24;
    let M = B % 30;
    let C = 2 * (this.#year % 4) + 4 * (this.#year % 7) + 6 * M + 5;
    let N = C % 7;
    let P = M + N;
    let easter = `${this.#year}-03-${P + 22}`;
    if (P > 9) {
      easter = `${this.#year}-04-${P - 9}`;
    }
    return easter;
  }

  #updateOffDays() {
    //TODO : compléter Méthode getOffDays
    // await downloadOffDays(this.year)
    //   .then((response) => this.#offDays = JSON.parse(response))
    //   .then(() => console.log(`Jours fériés mis à jour:\n${JSON.stringify(this.#offDays)}`));
    this.#offDays.set("1er janvier", `${this.#year}-01-01`);
    let easter = this.#getEasterDate();
    this.#offDays.set("Pâques", `${easter}`);
    this.#offDays.set("Lundi de Pâques", `${addDays(new Date(easter), 1)}`);
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
    this.#updateOffDays();
    this.#updateWeekNumbers();
    this.#updateWorkingWeeks();
  }

  get weeksNumber() {
    return this.#weeksNumber;
  }
}
