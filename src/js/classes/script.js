import { Year } from "./year.js";

var year = new Year();

function changeYear(event) {
  let newYear = event.target.value;
  year.year = newYear;
}

document.addEventListener("DOMContentLoaded", (event) => {
  let yearInputElt = document.querySelector("#year");
  yearInputElt.value = year.year;
  yearInputElt.addEventListener("change", changeYear);
});
