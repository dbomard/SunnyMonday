import { Year } from "./classes/year.js";
import { Team } from "./classes/team.js";
import { Day } from "./classes/day.js";
import { weekTypes } from "./week.js";

const currentYear = new Year();
/**@type {Array.<Team>} */
const teams = new Array(5);

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
      } else {
        newDay.classList.add("table-secondary");
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
  let yearInputElt = document.querySelector("#yearInput");
  let date = new Date();
  yearInputElt.value = date.getFullYear();
  const evt = new Event("change");
  yearInputElt.setAttribute("min", parseInt(yearInputElt.value) - 6);
  yearInputElt.setAttribute("max", parseInt(yearInputElt.value) + 1);
  yearInputElt.addEventListener("change", changeYear);
  teams[0] = new Team("Verte", "table-success", currentYear, [
    weekTypes.typeA,
    weekTypes.typeB,
    weekTypes.typeC,
    weekTypes.typeD,
  ]);
  teams[1] = new Team("Rouge", "table-danger", currentYear, [
    weekTypes.typeB,
    weekTypes.typeC,
    weekTypes.typeD,
    weekTypes.typeA,
  ]);
  teams[2] = new Team("Jaune", "table-warning", currentYear, [
    weekTypes.typeC,
    weekTypes.typeD,
    weekTypes.typeA,
    weekTypes.typeB,
  ]);
  teams[3] = new Team("Bleue", "table-primary", currentYear, [
    weekTypes.typeD,
    weekTypes.typeA,
    weekTypes.typeB,
    weekTypes.typeC,
  ]);
  teams[4] = new Team("Mediathèque", "table-light", currentYear, [
    weekTypes.open,
  ]);
  yearInputElt.dispatchEvent(evt);
});
