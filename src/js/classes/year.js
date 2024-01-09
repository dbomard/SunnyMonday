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
  return `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
}

export class Year {
  #year;
  #weeksNumber;
  #weeks;
  #offDays;

  constructor() {
    this.#offDays = new Map();
    this.#weeks = new Map();
    let date = new Date();
    this.year = date.getFullYear();
  }

  #updateWorkingWeeks() {
    //TODO : compléter méthode updateWorkingWeeks
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
    this.#offDays.set("1er janvier", `${this.#year}-01-01`);
    let easter = this.#getEasterDate();
    this.#offDays.set("Pâques", `${easter}`);
    this.#offDays.set("Lundi de Pâques", `${addDays(new Date(easter), 1)}`);
    this.#offDays.set("Fête du travail", `${this.#year}-05-01`);
    this.#offDays.set("Ascension", `${addDays(new Date(easter), 39)}`);
    this.#offDays.set("Pentecôte", `${addDays(new Date(easter), 49)}`);
    this.#offDays.set("Lundi de Pentecôte", `${addDays(new Date(easter), 50)}`);
    this.#offDays.set("Fête Nationale", `${this.#year}-07-14`);
    this.#offDays.set("Assomption", `${this.#year}-08-15`);
    this.#offDays.set("Toussaint", `${this.#year}-11-01`);
    this.#offDays.set("Armistice 1918", `${this.#year}-11-11`);
    this.#offDays.set("Noël", `${this.#year}-12-25`);
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
