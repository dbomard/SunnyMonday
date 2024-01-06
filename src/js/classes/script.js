import { Year } from "./year.js";
import { Team } from "./team.js";

var year = new Year();
var teamA = new Team("Equipe Verte", "#53cc08");
var teamB = new Team("Equipe Orange", "#f59d05");
var teamC = new Team("Equipe Jaune", "#eaf20a");
var teamD = new Team("Equipe Bleue", "#69befa");

function changeYear(event) {
  let newYear = event.target.value;
  year.year = newYear;
}

document.addEventListener("DOMContentLoaded", (event) => {
  let yearInputElt = document.querySelector("#year");
  yearInputElt.value = year.year;
  yearInputElt.addEventListener("change", changeYear);
});
