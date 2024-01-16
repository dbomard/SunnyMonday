import { Week } from "./week.js"
import { weekTypes } from "../week.js"
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
    for (let index = (firstWeek >= 52) ? 0 : 1; index <= lastWeek; index++) {
      // console.log("Nouvelle semaine");
      let days = new Array();
      do {
        // console.log(day.toDateString());
        days.push(day);
        day = day.addDays(1);
      } while (day.getDay() !== 1 && day.getFullYear() == this.#year.year);
      let week = new Week(days)
      if (this.#year.holidays.has(index) || index === 0 || index >= 52) {
        week.holidayWeek = true;
      }
      // TODO : corriger les semaines 0 et 53 lorsque les 1 et 31 janvier tombent dessus
      this.#weeks.set(index, week);
    }
  }

  updateWeeks() {
    console.log(`Mise à jour des semaines pour l'équipe ${this.#name}`);
    let weekIndex = 0;
    this.#computeWeeks();
    let holidayWeeks = this.#year.holidays;
    for (let index of this.#weeks.keys()) {
      let week = this.#weeks.get(index);
      let weekType = weekTypes.open;
      if (holidayWeeks.has(index) || index === 0 || index === 53) {
        // console.log("Semaine de vacances : ", index);
        weekType = weekTypes.holidays;
      } else {
        // console.log("Semaine hors vacances : ", index);
        weekType = this.#pattern[weekIndex];
        weekIndex++;
        if (weekIndex >= this.#pattern.length) {
          weekIndex = 0;
        }
      }
      for (let [dayName, day] of week.days) {
        // console.log(dayName, day);
        day.workingDay = weekType[dayName];
      }
    }
    for (let [index, week] of this.#weeks) {
      let weekStr = `semaine ${index}. vacances=>${week.holidayWeek} `
      let days = "";
      for (let [index, day] of week.days) {
        days += index + ":" + day.workingDay + " ";
      }
      console.log(weekStr + days);
    }
  }

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }

  get workingDaysCount() {
    let count = 0;
    for (let week of this.#weeks.values()) {
      for (let day of week.days.values()) {
        if (day.workingDay === true) {
          count++;
        }
      }
    }
    return count;
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
