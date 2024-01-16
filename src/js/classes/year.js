import "../dateUtils.js";
import { getHolidays } from "../sockets.js";

export class Year {
  #year;
  #weeksCount;
  #publicHolidays;
  #holidays;

  constructor() {
    // this.#initialize();
    // let date = new Date();
    // this.setYear(date.getFullYear());
    // this.#updateWorkingWeeks();
  }

  #initialize() {
    this.#publicHolidays = new Map();
    this.#holidays = new Map();
  }

  /**
   * MAJ les vacances scolaires
   */
  async #updateHolidays() {
    await getHolidays(this.#year)
      .then((holidays) => {
        // console.log(holidays);
        for (let holiday of holidays) {
          let description = holiday.description;
          let start_date = holiday.start_date;
          let end_date = holiday.end_date;
          if (start_date.startsWith(this.year) && end_date.startsWith(this.year) && !description.startsWith('Pont')) {
            // console.log(holiday);
            let day1 = new Date(start_date);
            let day2 = new Date(end_date);
            let week = day1.getWeek();
            if (day1.getDay() >= 4) {
              week++;
            }
            let duration = Math.floor(((day2.getTime() - day1.getTime()) / (1000 * 60 * 60 * 24)) / 7);
            for (let i = week; i < week + duration; i++) {
              this.#holidays.set(i, { "description": description })
              console.log(`${this.#holidays.get(i).description} ajoutées`);
            }
          } else if (description === "Vacances de Noël") {
            // console.log(holiday);
            let day;
            let delta;
            if (end_date.startsWith(this.year)) {
              day = new Date(end_date);
              delta = -1;
            } else if (start_date.startsWith(this.year)) {
              day = new Date(start_date);
              delta = 1;
            }
            let holidayWeek = day.getWeek() + delta;
            if (holidayWeek === 53 && delta === -1) {
              holidayWeek = -1;
            }
            this.#holidays.set(holidayWeek, { "description": description })
            console.log(`${this.#holidays.get(holidayWeek).description} ajoutées`);
          }
        }
      });
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

  get holidays() {
    return this.#holidays;
  }

  async setYear(newYear) {
    this.#initialize();
    this.#year = newYear;
    this.#updateWeeksCount();
    this.#updatePublicHolidays();
    await this.#updateHolidays()
      .then(() => console.log(`Année changée\n`));
  }

  get weeksCount() {
    return this.#weeksCount;
  }
}
