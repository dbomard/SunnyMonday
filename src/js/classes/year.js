import "../dateUtils.js";
import { getHolidays } from "../sockets.js";

export class Year {
  #year;
  #weeksCount;
  #publicHolidays;

  constructor(year) {
    this.setYear(year);
  }

   /**
   * @returns Date de Pâques
   */
  getEasterDate() {
    let B = 19 * (this.#year % 19) + 24;
    let M = B % 30;
    let C = 2 * (this.#year % 4) + 4 * (this.#year % 7) + 6 * M + 5;
    let N = C % 7;
    let P = M + N;
    let easter = `${this.#year}-03-${P + 22}`;
    if (P > 9) {
      easter = `${this.#year}-04-${P - 9}`;
    }
    return new Date(easter);
  }

  /**
   * Calcul les jours fériés
   */
  #updatePublicHolidays() {
    this.#publicHolidays.set("1er janvier", new Date(`${this.#year}-01-01`));
    let easter = this.getEasterDate();
    this.#publicHolidays.set("Pâques", easter);
    this.#publicHolidays.set("Lundi de Pâques", easter.addDays(1));
    this.#publicHolidays.set("Fête du travail", new Date(`${this.#year}-05-01`));
    this.#publicHolidays.set("Ascension", easter.addDays(39));
    this.#publicHolidays.set("Pentecôte", easter.addDays(49));
    this.#publicHolidays.set("Lundi de Pentecôte", easter.addDays(50));
    this.#publicHolidays.set("Fête Nationale", new Date(`${this.#year}-07-14`));
    this.#publicHolidays.set("Assomption", new Date(`${this.#year}-08-15`));
    this.#publicHolidays.set("Toussaint", new Date(`${this.#year}-11-01`));
    this.#publicHolidays.set("Armistice 1918", new Date(`${this.#year}-11-11`));
    this.#publicHolidays.set("Noël", new Date(`${this.#year}-12-25`));
  }

  /**
   * Calcul le nombre de semaines
   */
  #updateWeeksCount() {
    let date = new Date(this.#year, 11, 28);
    this.#weeksCount = date.getWeek();
    console.log(`${this.#weeksCount} semaines dans l'année ${this.#year}`);
  }

  get publicHolidays() {
    return this.#publicHolidays;
  }

  get year() {
    return this.#year;
  }

  get weeksCount() {
    return this.#weeksCount;
  }
}
