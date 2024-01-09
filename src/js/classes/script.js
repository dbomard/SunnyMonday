import { Year } from "./year.js";
import { Team } from "./team.js";

var year = new Year();
var teams = new Array(4);
teams[0] = new Team("Verte", "#53cc08");
teams[1] = new Team("Orange", "#f59d05");
teams[2] = new Team("Jaune", "#eaf20a");
teams[3] = new Team("Bleue", "#69befa");
// console.log(teams);

function updateTeams() {
  console.log(`Mise à jour des équipes pour ${year.year}`);
  let table = document.querySelector("#table-teams");
  table.innerHTML = "";
  teams.forEach((team, index) => {
    let newRow = document.createElement('tr');
    newRow.id = `team${index}`;
    newRow.innerHTML = `
      <td>${team.name}</td>
      <td>${team.workingDays}</td>
      <td>${team.oneDayWeekends}</td>
      <td>${team.twoDaysWeekends}</td>
      <td>${team.threeDaysWeekends}</td>`;
    table.appendChild(newRow);
  });
}

function showOffDays() {
  let tableName = document.querySelector("#dayOffName");
  tableName.innerHTML = `<th scope="row">Jour férié :</th>`;
  let tableDate = document.querySelector("#dayOffDate");
  tableDate.innerHTML = `<th scope="row">Date :</th>`;
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
  // TODO: corriger les infos asynchrones
  updateTeams();
  showOffDays();
}

document.addEventListener("DOMContentLoaded", (event) => {
  let yearInputElt = document.querySelector("#yearInput");
  yearInputElt.value = year.year;
  updateTeams();
  showOffDays();

  yearInputElt.addEventListener("change", changeYear);
});
