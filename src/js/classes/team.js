import { Week } from "./week.js"
import "../dateUtils.js"

export class Team {
  #name;
  #color;
  #weeks;

  #pattern;

  #oneDayWeekends;
  #twoDaysWeekends;
  #threeDaysWeekends;
  #workingDaysCount;
  #year;

  /**
   * 
   * @param {string} name 
   * @param {string} color Code couleur Bootstrap 5
   * @param {Year} currentYear 
   * @param {Array<Object>} weeksPattern 
   */
  constructor(name, color, currentYear, weeksPattern) {
    this.#name = name;
    this.#color = color;
    this.#year = currentYear;
    this.#pattern = weeksPattern;
    this.#weeks = new Map();
    // this.#computeWeeks();
  }

  #computeWeeks() {
    for (let week of this.#weeks.keys()) {
      this.#weeks.delete(week);
    }
    let index = 1;
    // 31 décembre sur année suivante ?
    let day = new Date(this.#year.year, 11, 31);
    let lastWeek = day.getWeek();
    if (lastWeek === 1) {
      lastWeek = this.#year.weeksCount + 1;
    } else {
      lastWeek = this.#year.weeksCount;
    }
    // premier janvier sur année précédente ou année en cours ?
    day = new Date(this.#year.year, 0, 1);
    let firstWeek = day.getWeek();
    if (firstWeek === 53 || firstWeek === 52) {
      index = 0;
    }
    for (; index <= lastWeek; index++) {
      // console.log("Nouvelle semaine");
      let days = new Array();
      let holiday = false;
      do {
        // console.log(day.toDateString());
        days.push(day);
        day = day.addDays(1);
      } while (day.getDay() !== 1 && day.getFullYear() == this.#year.year);
      if (this.#year.holidays.has(index)) {
        holiday = true;
      }
      this.#weeks.set(index, new Week(days, holiday));
    }
  }

  update() {
    console.log(`Mise à jour de l'équipe ${this.#name}`);
    this.#computeWeeks();
  }

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }

  get workingDaysCount() {
    return 365;
    // TODO: finir la méthode getWorkingdaysCount
  }

  get oneDayWeekends() {
    return 1;
    // TODO: finir la méthode get1DaysWeekend
  }

  get twoDaysWeekends() {
    return 2;
    // TODO: finir la méthode get2DaysWeekend
  }

  get threeDaysWeekends() {
    return 3;
    // TODO: finir la méthode get3DaysWeekend
  }
}
