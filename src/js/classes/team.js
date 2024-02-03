import "../dateUtils.js";

export class Team {
  #name;
  #color;
  #pattern;
  #days

  /**
   *
   * @param {string} name
   * @param {Array} weeksPattern
   * @param {string} color 
   * @param {Array.<date>} days 
   */
  constructor(name, weeksPattern, color = "#cfcfcf") {
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
      console.log(`${newDay.toLocaleDateString()} : ${newDay.getWeekend()}`);
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
    count -= 25;
    return count;
  }

  oneDayWeekends() {
    return 1;
  }

  saturdaySundayWeekends() {
    return 2;
  }

  sundayMondayWeekends() {
    return 2;
  }

  threeDaysWeekends() {
    return 3;
  }

  get days() {
    return this.#days;
  }

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }
}
