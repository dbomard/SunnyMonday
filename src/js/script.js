import { Year } from "./classes/year.js";
import { Team } from "./classes/team.js";
import { weekTypes } from "./week.js";


const currentYear = new Year();
const teams = new Array(4);
teams[0] = new Team("Verte", "table-success", currentYear, [weekTypes.typeA, weekTypes.typeB, weekTypes.typeC, weekTypes.typeD]);
teams[1] = new Team("Rouge", "table-danger", currentYear, [weekTypes.typeB, weekTypes.typeC, weekTypes.typeD, weekTypes.typeA]);
teams[2] = new Team("Jaune", "table-warning", currentYear, [weekTypes.typeC, weekTypes.typeD, weekTypes.typeA, weekTypes.typeB]);
teams[3] = new Team("Bleue", "table-primary", currentYear, [weekTypes.typeD, weekTypes.typeA, weekTypes.typeB, weekTypes.typeC]);
teams[4] = new Team("Mediathèque", "table-secondary", currentYear, [weekTypes.typeD, weekTypes.typeA, weekTypes.typeB, weekTypes.typeC]);

function updateTeamsSection() {
  // MAJ Affichage
  let table = document.querySelector("#table-teams");
  table.innerHTML = "";
  teams.forEach((team, index) => {
    team.update(currentYear);
    let newRow = document.createElement("tr");
    newRow.id = `team${index}`;
    newRow.classList.add(team.color);
    newRow.innerHTML = `
      <td>${team.name}</td>
      <td>${team.workingDaysCount}</td>
      <td>${team.oneDayWeekends}</td>
      <td>${team.twoDaysWeekends}</td>
      <td>${team.threeDaysWeekends}</td>`;
    table.appendChild(newRow);
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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  days.forEach((date, day) => {
    let newDay = document.createElement("td");
    newDay.innerText = `${day}`;
    tableName.appendChild(newDay);
    let newDate = document.createElement("td");
    newDate.innerText = `${date.toLocaleDateString('fr-FR', options)}`;
    tableDate.appendChild(newDate);
  });
}

async function changeYear(event) {
  let newYear = event.target.value;
  await currentYear.setYear(newYear)
    .then(() => updateYearSection())
    .then(() => updateTeamsSection());
}

document.addEventListener("DOMContentLoaded", () => {
  let yearInputElt = document.querySelector("#yearInput");
  let date = new Date();
  yearInputElt.value = date.getFullYear();
  const evt = new Event("change");
  yearInputElt.setAttribute("min", currentYear.year - 6);
  yearInputElt.setAttribute("max", currentYear.year + 1);
  yearInputElt.addEventListener("change", changeYear);
  yearInputElt.dispatchEvent(evt);
});
