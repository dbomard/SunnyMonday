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
  console.log(`Mise à jour des équipes pour ${year.year}`);

  // MAJ Objets Teams
  for (let team of teams) {
    // console.log("mise à jour de la team ", team);
    team.workingDaysCount = year.getWorkingDaysCount();
  }

  // MAJ Affichage
  let table = document.querySelector("#table-teams");
  table.innerHTML = "";
  teams.forEach((team, index) => {
    let newRow = document.createElement('tr');
    team.update(year);
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
    let newDay = document.createElement('td');
    newDay.innerText = `${day}`;
    tableName.appendChild(newDay);
    let newDate = document.createElement('td');
    newDate.innerText = `${date}`;
    tableDate.appendChild(newDate);
  });
}

function changeYear(event) {
  let newYear = event.target.value;
  year.year = newYear;
  updateTeams();
  showOffDays();
}

document.addEventListener("DOMContentLoaded", (event) => {
  let yearInputElt = document.querySelector("#yearInput");
  yearInputElt.value = year.year;
  yearInputElt.setAttribute("min", year.year - 6);
  yearInputElt.setAttribute("max", year.year + 1);

  updateTeams();
  showOffDays();

  yearInputElt.addEventListener("change", changeYear);
});
