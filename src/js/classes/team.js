import "../dateUtils.js";
import { Color } from "./color.js";

export class Team {
  #name;
  #color;
  #pattern;
  #days

  /**
   *
   * @param {string} name
   * @param {Array} weeksPattern
   * @param {Color} color 
   * @param {Array.<date>} days 
   */
  constructor(name, weeksPattern, color = new Color("#cfcfcf")) {
    this.#name = name;
    this.#pattern = weeksPattern;
    this.#color = color;
    this.#days = new Array();
  }

  resetDays() {
    this.#days = new Array();
  }

  /**
   * 
   * @param {Date} date 
   * @param {integer} patternIndex 
   */
  addDay(date, patternIndex) {
    let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    /**@type {Date} newDay */
    let newDay = date.getCopy();
    if (!newDay.holiday) {
      let index = patternIndex % this.#pattern.length;
      let week = this.#pattern[index];
      let dayName = days[newDay.getDay()];
      let working = week[dayName];
      newDay.setWeekend(!working);
      // console.log(`${newDay.toLocaleDateString()} : ${newDay.getWeekend()}`);
    } else {
      newDay.setWeekend(newDay.getDay() === 0 || newDay.getDay() === 1);
    }

    this.#days.push(newDay);
  }

  workingDaysCount() {
    let count = 0;
    for (let day of this.#days) {
      if (!day.getWeekend() && !day.getPublicDay()) {
        count++;
      }
    }
    return count;
  }

  countWeekends(sat, sun, mon) {
    let count = 0;
    let saturday = false;
    let sunday = false;
    let monday = false;
    for (let day of this.#days) {
      switch (day.getDay()) {
        case 6:
          saturday = day.getWeekend() || day.getPublicDay();
          break;
        case 0:
          sunday = day.getWeekend() || day.getPublicDay();
          break;
        case 1:
          monday = day.getWeekend() || day.getPublicDay();
          if (saturday === sat && sunday === sun && monday === mon) {
            count++;
          }
          saturday = false;
          sunday = false;
          monday = false;
          break;
      }
    }
    return count;
  }

  oneDayWeekends() {
    return this.countWeekends(false, true, false);
  }

  saturdaySundayWeekends() {
    return this.countWeekends(true, true, false);
  }

  sundayMondayWeekends() {
    return this.countWeekends(false, true, true);
  }

  threeDaysWeekends() {
    return this.countWeekends(true, true, true);
  }

  /**
   * @returns {Date}
   */
  get days() {
    return this.#days;
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * @returns {Color}
   */
  get color() {
    return this.#color;
  }
}
