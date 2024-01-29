import { Year } from "./classes/year.js";
import { Team } from "./classes/team.js";
import { Day } from "./classes/day.js";
import { Holiday } from "./classes/holiday.js"
import { weekTypes } from "./week.js";
import { getHolidays } from "./sockets.js";

const currentYear = new Year();

/**@type {Array.<Team>} */
const teams = new Array(5);

/**@type {Array.<Holiday>} */
const holidays = new Array();

/**
 * 
 * @param {Holiday} holidayA 
 * @param {Holiday} holidayB 
 */
function sortHolidays(holidayA, holidayB) {
  if (holidayA.startingDate === holidayB.startingDate) {
    return 0;
  }
  if (holidayA.startingDate < holidayB.startingDate) {
    return -1;
  }
  return 1;
}

async function initialisation() {
  // Création des équipes
  teams[0] = new Team("Verte", [weekTypes.typeA, weekTypes.typeB,
  weekTypes.typeC, weekTypes.typeD], "#98eb34");
  teams[1] = new Team("Rouge", [weekTypes.typeB, weekTypes.typeC,
  weekTypes.typeD, weekTypes.typeA], "#eb4634");
  teams[2] = new Team("Jaune", [weekTypes.typeC, weekTypes.typeD,
  weekTypes.typeA, weekTypes.typeB], "#eb4634");
  teams[3] = new Team("Bleue", [weekTypes.typeD, weekTypes.typeA,
  weekTypes.typeB, weekTypes.typeC], "#3480eb");
  teams[4] = new Team("Mediathèque", [weekTypes.open]);

  // Création de la liste des vacances
  await getHolidays()
    .then((results) => {
      for (let holiday of results) {
        if (!holiday.description.toLowerCase().includes("pont")) {
          let newHoliday = new Holiday(
            holiday.description,
            new Date(holiday.start_date),
            new Date(holiday.end_date)
          );
          holidays.push(newHoliday);
        }
      }
      holidays.sort(sortHolidays);
    })
    .then(() => {
      let today = new Date();
      let startingDateElt = document.querySelector("#startingDate");
      let endingDateElt = document.querySelector("#endingDate");
      startingDateElt.value = `${today.getFullYear()}-01-01`;
      endingDateElt.value = `${today.getFullYear()}-12-31`;

      let minDate = holidays[0].startingDate.toISOString().substring(0, 10);
      let maxDate = holidays.slice(-1)[0].endingDate.toISOString().substring(0, 10);

      startingDateElt.max = maxDate;
      startingDateElt.min = minDate;
      endingDateElt.max = maxDate;
      endingDateElt.min = minDate;

      const evt = new Event("change");
      startingDateElt.addEventListener("change", changeInterval);
      endingDateElt.addEventListener("change", changeInterval);
      startingDateElt.dispatchEvent(evt);
    })

}

function changeInterval(e) {
  let startingDateElt = document.querySelector("#startingDate");
  let endingDateElt = document.querySelector("#endingDate");
  let startingDate = new Date(startingDateElt.value);
  let endingDate = new Date(endingDateElt.value);
  let holidayList = document.querySelector("#holidays");
  holidayList.innerHTML = "";
  let format = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  for (let holiday of holidays) {
    if ((holiday.startingDate > startingDate && holiday.startingDate < endingDate) ||
      (holiday.endingDate > startingDate && holiday.endingDate < endingDate)) {
      let newItem = document.createElement('li');
      newItem.classList.add('list-group-item');
      newItem.innerText = `${holiday.name} du ${holiday.startingDate.toLocaleDateString('fr-FR', format)} au ${holiday.endingDate.toLocaleDateString('fr-FR', format)}`;
      holidayList.appendChild(newItem);
    }
  }
}

function resetCalendar() {
  let text = document.querySelector("#team-detail p");
  text.classList.remove("hidden");
  let calendar = document.querySelector("#calendar");
  calendar.innerHTML = "";
}

function selectTeam(event) {
  let monthNames = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  let dayNames = ["D", "L", "M", "M", "J", "V", "S"];
  let text = document.querySelector("#team-detail p");
  text.classList.add("hidden");
  let teamIndex = event.currentTarget.id.substring(4);
  let team = teams[teamIndex];
  console.log("Equipe cliquée: " + teamIndex);
  let calendar = document.querySelector("#calendar");
  calendar.innerHTML = "";
  let calendarTemplate = document.getElementById("calendar-template");
  let clonedCalendarTemplate = calendarTemplate.content.cloneNode(true);
  calendar.appendChild(clonedCalendarTemplate);

  let headingRow = calendar.querySelector("thead tr");
  for (let i = 1; i <= 31; i++) {
    let day = document.createElement("th");
    day.innerText = i;
    day.classList.add("table-dark");
    headingRow.appendChild(day);
  }
  let tableBody = calendar.querySelector("tbody");
  let currentMonth = -1;
  let currentRaw = null;
  for (let week of team.weeks.values()) {
    /**@type {Day} day */
    let day;
    for (day of week.days.values()) {
      if (day.date.getMonth() !== currentMonth) {
        currentMonth++;
        currentRaw = document.createElement("tr");
        let newHeader = document.createElement("th");
        newHeader.innerText = monthNames[currentMonth];
        newHeader.classList.add("table-dark");
        currentRaw.appendChild(newHeader);
        tableBody.appendChild(currentRaw);
      }
      let name = dayNames[day.date.getDay()];
      let newDay = document.createElement("td");
      if (day.workingDay === true) {
        newDay.classList.add(team.color);
      }
      else {
        newDay.classList.add("table-secondary");
      }
      if (week.holidayWeek === true) {
        newDay.classList.add("holiday");
      }
      newDay.innerText = name;
      currentRaw.appendChild(newDay);
    }
  }
}

function updateTeamsSection() {
  // MAJ Affichage
  let table = document.querySelector("#table-teams");
  table.innerHTML = "";
  teams.forEach((team, index) => {
    let newRow = document.createElement("tr");
    newRow.id = `team${index}`;
    newRow.classList.add(team.color);
    newRow.innerHTML = `
    <td>${team.name}</td>
      <td class="spinner">${team.workingDaysCount}</td>
      <td class="spinner">${team.workingDaysCount * 7}</td>
      <td class="spinner">${team.oneDayWeekends}</td>
      <td class="spinner">${team.saturdaySundayWeekends}</td>
      <td class="spinner">${team.sundayMondayWeekends}</td>
      <td class="spinner">${team.threeDaysWeekends}</td>`;
    table.appendChild(newRow);
    newRow.addEventListener("click", selectTeam);
  });
}

function updateYearSection() {
  let tableName = document.querySelector("#dayOffName");
  tableName.innerHTML = `<th scope="row">Jour férié</th>`;
  let tableDate = document.querySelector("#dayOffDate");
  tableDate.innerHTML = `<th scope="row">Date</th>`;
  let days = currentYear.offDays;
  days = currentYear.publicHolidays;
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  days.forEach((date, day) => {
    let newDay = document.createElement("td");
    newDay.innerText = `${day}`;
    tableName.appendChild(newDay);
    let newDate = document.createElement("td");
    newDate.classList.add("spinner");
    newDate.innerText = `${date.toLocaleDateString("fr-FR", options)}`;
    tableDate.appendChild(newDate);
  });
}

function updateTeamObjects() {
  // console.log("Mise à jour des équipes");
  for (let team of teams) {
    team.updateWeeks();
  }
}

async function changeYear(event) {
  let waitingElements = document.querySelectorAll(".spinner");
  for (let element of waitingElements) {
    element.innerText = "";
    element.innerHTML = `<span class="spinner-border spinner-border-sm text-secondary" aria-hidden="true"></span>
      <span role="status" class="text-secondary">Loading...</span>`;
  }
  let newYear = event.target.value;
  await currentYear
    .setYear(newYear)
    .then(() => updateTeamObjects())
    .then(() => updateYearSection())
    .then(() => updateTeamsSection())
    .then(() => resetCalendar());
}

document.addEventListener("DOMContentLoaded", () => {
  initialisation();
});
