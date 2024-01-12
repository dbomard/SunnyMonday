import "./dateExtras.js";
import { weekTypes } from "./week.js";
import { getHolidays } from "./sockets.js";

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
  #weeksCount;
  #weeks;
  #offDays;
  #holidays;

  constructor() {
    // this.#initialize();
    let date = new Date();
    this.setYear(date.getFullYear());
    // this.#updateWorkingWeeks();
  }

  #initialize() {
    this.#offDays = new Map();
    this.#weeks = new Map();
    this.#holidays = new Map();
  }

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
          } else if (description === "Vacances de Noël" && end_date.startsWith(this.year)) {
            console.log("Vacances de Noël");
            let day = new Date(end_date);
            let holidayWeek = day.getWeek() - 1;
            if (holidayWeek === 53) {
              holidayWeek = -1;
            }
            this.#holidays.set(holidayWeek, { "description": description })
          } else if (description === "Vacances de Noël" && start_date.startsWith(this.year)) {
            console.log("Vacances de Noël");
            let day = new Date(start_date);
            this.#holidays.set(day.getWeek() + 1, { "description": description })
          }
        }
      });
  }

  #setOffDayToWeeks(dateString) {
    let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    // console.log(`${dateString} ${this}`);
    let date = new Date(dateString);
    let weekNumber = date.getWeek()
    if (weekNumber === 53 && this.size === 52) {
      weekNumber = -1;
      this.set(weekNumber, JSON.parse(JSON.stringify(weekTypes.open)));
    }
    let week = this.get(weekNumber);
    let day = days[date.getDay()];
    week[day] = false;
  }

  async #updateWorkingWeeks() {
    this.#updateWeeksCount();
    // Pour toutes les semaines : travail du lundi au samedi
    for (let i = 1; i <= this.weeksCount; i++) {
      this.#weeks.set(i, JSON.parse(JSON.stringify(weekTypes.open)));
    }
    // Ajout des semaines de vacances
    await this.#updateHolidays()
      .then(() => {
        for (let holidayWeek of this.#holidays.keys()) {
          // console.log(holidayWeek);
          this.#weeks.set(holidayWeek, JSON.parse(JSON.stringify(weekTypes.holidays)));

        }
      })
      .then(() => {
        // Ajout des jours fériés
        this.#offDays.forEach(this.#setOffDayToWeeks, this.#weeks);
      })
      .then(() => {
        // Test
        console.log("Jours d'ouverture de la Médiathèque : ", this.getWorkingDaysCount());
      })
  }

  /**
   * @returns Date de Pâques
   */
  #getEasterDate() {
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

  #updateWeeksCount() {
    let date = new Date(this.#year, 11, 28);
    this.#weeksCount = date.getWeek();
    console.log(`${this.#weeksCount} semaines dans l'année ${this.#year}`);
  }

  get offDays() {
    return this.#offDays;
  }

  get year() {
    return this.#year;
  }

  async setYear(newYear) {
    this.#initialize();
    console.log(`Année changée\n`);
    this.#year = newYear;
    this.#updateOffDays();
    await this.#updateWorkingWeeks();
  }

  get weeksCount() {
    return this.#weeksCount;
  }

  getWorkingDaysCount() {
    let days = 0;
    let weeks = this.#weeks.values();
    for (let week of weeks) {
      for (let day in week) {
        if (week[day] === true) {
          days++
        }
      }
    }
    return days;
  }
}
