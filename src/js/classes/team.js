export class Team {
  #name;
  #color;

  #pattern;
  #oneDayWeekends;
  #twoDaysWeekends;
  #threeDaysWeekends;
  #workingDaysCount;
  #year;

  constructor(name, color, currentYear, weeksPattern) {
    this.#name = name;
    this.#color = color;
    this.#year = currentYear;
  }

  update() {
    console.log(`Mise à jour de l'équipe ${this.#name}`);
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
