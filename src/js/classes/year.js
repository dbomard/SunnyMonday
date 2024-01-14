import "./dateUtils.js";
import { getHolidays } from "./sockets.js";

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
  #weeksCount;
  #publicHolidays;
  #holidays;

  constructor() {
    // this.#initialize();
    let date = new Date();
    this.setYear(date.getFullYear());
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
    await getHolidays()
      .then((holidays) => {
        for (let holiday of holidays) {
          // console.log(holiday);
          let description = holiday.description;
          let start_date = holiday.start_date;
          let end_date = holiday.end_date;
          if (start_date.startsWith(this.year) && end_date.startsWith(this.year)) {
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
            console.log("Vacances de Noël");
            if (end_date.startsWith(this.year)) {
              let day = new Date(end_date);
              let delta = -1;
            } else if (start_date.startsWith(this.year)) {
              let day = new Date(start_date);
              let delta = 1;
            }
            let holidayWeek = day.getWeek() + delta;
            if (holidayWeek === 53 && delta === -1) {
              holidayWeek = -1;
            }
            this.#holidays.set(holidayWeek, { "description": description })
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
    return easter;
  }

  /**
   * Calcul les jours fériés
   */
  #updatePublicHolidays() {
    this.#publicHolidays.set("1er janvier", `${this.#year}-01-01`);
    let easter = this.getEasterDate();
    this.#publicHolidays.set("Pâques", `${easter}`);
    this.#publicHolidays.set("Lundi de Pâques", `${addDays(new Date(easter), 1)}`);
    this.#publicHolidays.set("Fête du travail", `${this.#year}-05-01`);
    this.#publicHolidays.set("Ascension", `${addDays(new Date(easter), 39)}`);
    this.#publicHolidays.set("Pentecôte", `${addDays(new Date(easter), 49)}`);
    this.#publicHolidays.set("Lundi de Pentecôte", `${addDays(new Date(easter), 50)}`);
    this.#publicHolidays.set("Fête Nationale", `${this.#year}-07-14`);
    this.#publicHolidays.set("Assomption", `${this.#year}-08-15`);
    this.#publicHolidays.set("Toussaint", `${this.#year}-11-01`);
    this.#publicHolidays.set("Armistice 1918", `${this.#year}-11-11`);
    this.#publicHolidays.set("Noël", `${this.#year}-12-25`);
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

  async setYear(newYear) {
    this.#initialize();
    this.#year = newYear;
    this.#updateWeeksCount();
    this.#updatePublicHolidays();
    await this.#updateHolidays();
    console.log(`Année changée\n`);
  }

  get weeksCount() {
    return this.#weeksCount;
  }
}
