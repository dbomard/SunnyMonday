// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.com/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
      7
    )
  );
};

/**
 *
 * @param {integer} daysCount - Nombre de jours à ajouter
 * @returns {Date} Nouvel objet Date
 */
Date.prototype.addDays = function (daysCount) {
  const newDate = new Date(
    this.getFullYear(),
    this.getMonth(),
    this.getDate() + daysCount
  );
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * 
 * @param {integer} daysCount - Nombre de jours à soustraire
 * @returns {Date} New Date object
 */
Date.prototype.subDays = function (daysCount) {
  const newDate = new Date(
    this.getFullYear(),
    this.getMonth(),
    this.getDate() - daysCount
  );
  return newDate;
}

Date.prototype.equal = function (date) {
  return (
    this.getDate() === date.getDate() &&
    this.getMonth() === date.getMonth() &&
    this.getFullYear() === date.getFullYear()
  );
}



/**
 * Incrémente d'un jour
 */
Date.prototype.addOneDay = function () {
  this.setDate(this.getDate() + 1);
}

/**
 * Décrémente d'un jour
 */
Date.prototype.subOneDay = function () {
  this.setDate(this.getDate() - 1);
}

/**
 *
 * @returns {Date} A new Date objet that is a copy of current date
 */
Date.prototype.getCopy = function () {
  const newDate = new Date(this.toISOString());
  newDate.holiday = this.holiday;
  newDate.publicDay = this.publicDay;
  newDate.weekend = this.weekend;
  return newDate;
};

/**
 * @param {boolean} holiday - true = Set that day as holiday
 */
Date.prototype.setHoliday = function (holiday = true) {
  this.holiday = holiday;
};

/**
 * @returns {boolean} true if a holiday day
 */
Date.prototype.getHoliday = function () {
  if (this.holiday === undefined || this.holiday === false) {
    return false;
  }
  return true;
};

/**
 * @param {boolean} weekend - true = Set that day as part of weekend
 */
Date.prototype.setWeekend = function (weekend = true) {
  this.weekend = weekend;
};

/**
 * @returns {boolean} true if a weekend day
 */
Date.prototype.getWeekend = function () {
  if (this.weekend === undefined || this.weekend === false) {
    return false;
  }
  return true;
};

/**
 * @param {boolean} publicDay - true = Set that day as public day
 */
Date.prototype.setPublicDay = function (publicDay = true) {
  this.publicDay = publicDay;
};

/**
 * @returns {boolean} true if a public day
 */
Date.prototype.getPublicDay = function () {
  if (this.publicDay === undefined || this.publicDay === false) {
    return false;
  }
  return true;
};
