import { Year } from "./classes/year.js";
import { Team } from "./classes/team.js";
import { weekTypes } from "./week.js";

const currentYear = new Year();
const teams = new Array(5);

function selectTeam(event) {
  l
  let text = document.querySelector("#team-detail p");
  text.classList.add("hidden");
  let team = event.currentTarget.id.substring(4);
  console.log("Equipe cliquée: " + team);
  let sectionCalendar = document.querySelector("#calendar");
  let monthTemplate = document.getElementById("month-template");
  let Months = new Array();
  for (let month = 0; month < 12; month++) {
    Months.push(monthTemplate.content.cloneNode(true));
    sectionCalendar.appendChild(Months[month]);
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
    .then(() => updateTeamsSection());
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
  teams[4] = new Team("Mediathèque", "table-secondary", currentYear, [
    weekTypes.open,
  ]);
  yearInputElt.dispatchEvent(evt);
});
