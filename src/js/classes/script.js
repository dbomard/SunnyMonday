import { Year } from "./year.js";
import { Team } from "./team.js";

var year = new Year();
var teams = new Array(4);
teams[0] = new Team("Verte", "table-success");
teams[1] = new Team("Rouge", "table-danger");
teams[2] = new Team("Jaune", "table-warning");
teams[3] = new Team("Bleue", "table-primary");
// console.log(teams);

function updateTeams() {
  // MAJ Affichage
  let table = document.querySelector("#table-teams");
  table.innerHTML = "";
  teams.forEach((team, index) => {
    team.update(year);
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

function showOffDays() {
  let tableName = document.querySelector("#dayOffName");
  tableName.innerHTML = `<th scope="row">Jour férié</th>`;
  let tableDate = document.querySelector("#dayOffDate");
  tableDate.innerHTML = `<th scope="row">Date</th>`;
  let days = year.offDays;
  days = year.offDays;
  days.forEach((date, day) => {
    let newDay = document.createElement("td");
    newDay.innerText = `${day}`;
    tableName.appendChild(newDay);
    let newDate = document.createElement("td");
    newDate.innerText = `${date}`;
    tableDate.appendChild(newDate);
  });
}

async function changeYear(event) {
  let newYear = event.target.value;
  await year
    .setYear(newYear)
    .then(() => showOffDays())
    .then(() => updateTeams());
}

document.addEventListener("DOMContentLoaded", (event) => {
  let yearInputElt = document.querySelector("#yearInput");
  yearInputElt.value = year.year;
  const evt = new Event("change");
  yearInputElt.setAttribute("min", year.year - 6);
  yearInputElt.setAttribute("max", year.year + 1);
  yearInputElt.addEventListener("change", changeYear);
  yearInputElt.dispatchEvent(evt);
});
