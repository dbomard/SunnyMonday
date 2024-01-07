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

function changeYear(event) {
  let newYear = event.target.value;
  year.year = newYear;
  updateTeams();
}

document.addEventListener("DOMContentLoaded", (event) => {
  let yearInputElt = document.querySelector("#year");
  yearInputElt.value = year.year;
  yearInputElt.max = year.year + 4;
  yearInputElt.min = year.year - 20;
  updateTeams();
  yearInputElt.addEventListener("change", changeYear);
});
