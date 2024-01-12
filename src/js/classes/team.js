export class Team {
  #name;
  #color;
  #oneDayWeekends;
  #twoDaysWeekends;
  #threeDaysWeekends;
  #workingDays;

  constructor(name, color) {
    this.#name = name;
    this.#color = color;
    this.#oneDayWeekends = 1;
    this.#twoDaysWeekends = 2;
    this.#threeDaysWeekends = 3;
    this.#workingDays = 365;

  }

  update(year) {
    console.log(year);
  }

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }

  get workingDays() {
    return this.#workingDays;
    // TODO: finir la méthode getWorkingdays   
  }

  get oneDayWeekends() {
    return this.#oneDayWeekends;
    // TODO: finir la méthode get1DaysWeekend    
  }

  get twoDaysWeekends() {
    return this.#twoDaysWeekends;
    // TODO: finir la méthode get2DaysWeekend
  }
  get threeDaysWeekends() {
    return this.#threeDaysWeekends;
    // TODO: finir la méthode get3DaysWeekend
  }
}
