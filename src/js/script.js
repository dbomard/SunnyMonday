// import { Year } from "./classes/year.js";
import { Team } from "./classes/team.js";
import { Holiday } from "./classes/holiday.js";
import { weekTypes } from "./week.js";
import { getHolidays } from "./sockets.js";
import "./dateUtils.js";

// const currentYear = new Year();

/**@type {Array.<Team>} teams */
const teams = new Array(5);

/**@type {Date} dateReference - Date de référence pour le calcul des semaines */
const dateReference = new Date("2024-09-02T00:00:00Z");
dateReference.setHours(0, 0, 0, 0);

/**@type {Array.<Holiday>} holidays */
const holidays = new Array();

/**@type {Array.<Holiday>} currentHolidays*/
const currentHolidays = new Array();


/**
 * Tri selon la date de début de vacances
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
  teams[0] = new Team(
    "Verte",
    [weekTypes.typeA, weekTypes.typeB, weekTypes.typeC, weekTypes.typeD],
    "#80ff80"
  );
  teams[1] = new Team(
    "Rouge",
    [weekTypes.typeB, weekTypes.typeC, weekTypes.typeD, weekTypes.typeA],
    "#ff8080"
  );
  teams[2] = new Team(
    "Jaune",
    [weekTypes.typeC, weekTypes.typeD, weekTypes.typeA, weekTypes.typeB],
    "#ffff80"
  );
  teams[3] = new Team(
    "Bleue",
    [weekTypes.typeD, weekTypes.typeA, weekTypes.typeB, weekTypes.typeC],
    "#80ffff"
  );
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
      today.setHours(0, 0, 0, 0);
      let startingDateElt = document.querySelector("#startingDate");
      let endingDateElt = document.querySelector("#endingDate");
      startingDateElt.value = `${today.getFullYear()}-01-01`;
      endingDateElt.value = `${today.getFullYear()}-12-31`;

      let minDate = holidays[0].startingDate.toISOString().substring(0, 10);
      let maxDate = holidays
        .slice(-1)[0]
        .endingDate.toISOString()
        .substring(0, 10);

      startingDateElt.max = maxDate;
      startingDateElt.min = minDate;
      endingDateElt.max = maxDate;
      endingDateElt.min = minDate;

      const evt = new Event("change");
      startingDateElt.addEventListener("change", changeInterval);
      endingDateElt.addEventListener("change", changeInterval);
      startingDateElt.dispatchEvent(evt);
    });
}

function changeInterval(e) {
  let startingDateElt = document.querySelector("#startingDate");
  let endingDateElt = document.querySelector("#endingDate");
  let startingDate = new Date(startingDateElt.value);
  startingDate.setHours(0, 0, 0, 0);
  let endingDate = new Date(endingDateElt.value);
  endingDate.setHours(0, 0, 0, 0)

  // La date de début est toujours inférieure à la date de fin
  // et la date de fin est toujours supérieure à la date de début
  if (startingDate > endingDate && e.currentTarget.id === "startingDate") {
    startingDate = new Date(`${endingDateElt.value}T00:00:00Z`);
    startingDateElt.value = endingDateElt.value;
  } else if (endingDate < startingDate && e.currentTarget.id === "endingDate") {
    endingDate = new Date(`${startingDateElt.value}T00:00:00Z`);
    endingDateElt.value = startingDateElt.value;
  }

  // Affichage de la liste des vacances scolaires pour l'intervalle de temps
  /**@type {Array.<Holiday>} currentHolidays */
  let holidayList = document.querySelector("#holidays");
  holidayList.innerHTML = "";
  let format = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  for (let holiday of holidays) {
    if (
      (holiday.startingDate > startingDate &&
        holiday.startingDate < endingDate) ||
      (holiday.endingDate > startingDate && holiday.endingDate < endingDate) ||
      (startingDate > holiday.startingDate && endingDate < holiday.endingDate)
    ) {
      // Ajout de la période de vacances pour la période sélectionnée
      currentHolidays.push(holiday);

      let newItem = document.createElement("li");
      newItem.classList.add("list-group-item");
      newItem.innerText = `${holiday.name
        } du ${holiday.startingDate.toLocaleDateString(
          "fr-FR",
          format
        )} au ${holiday.endingDate.toLocaleDateString("fr-FR", format)}`;
      holidayList.appendChild(newItem);
    }
  }

  // Mise à jour des équipes
  updateTeamObjects(startingDate, endingDate);
  updateTeamsSection();
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
      } else {
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
    newRow.style.backgroundColor = team.color;
    newRow.innerHTML = `
    <td>${team.name}</td>
      <td class="spinner">${team.workingDaysCount()}</td>
      <td class="spinner">${team.workingDaysCount() * 7}</td>
      <td class="spinner">${team.oneDayWeekends()}</td>
      <td class="spinner">${team.saturdaySundayWeekends()}</td>
      <td class="spinner">${team.sundayMondayWeekends()}</td>
      <td class="spinner">${team.threeDaysWeekends()}</td>`;
    table.appendChild(newRow);
    newRow.addEventListener("click", selectTeam);
  });
}

/**
 *
 * @param {Date} startingDate - Date de début
 * @param {Date} endingDate - Date de fin
 */
function updateTeamObjects(startingDate, endingDate) {
  let weekReference = 0;
  /**@type {Date} currentDate */
  let currentDate = dateReference.getCopy();

  // Recherche du type de semaine de la startingDate
  if (!currentDate.equal(startingDate)) {
    do {
      if (currentDate < startingDate) {
        currentDate.addOneDay();
        for (let holiday of holidays) {
          if (holiday.isHoliday(currentDate)) {
            currentDate.setHoliday();
          }
        }
        if (currentDate.getDay() === 1 && currentDate.holiday !== undefined && !currentDate.holiday) {
          weekReference++;
        }
      } else if (startingDate < currentDate) {
        currentDate.subOneDay();
        currentDate.setHoliday(false);
        for (let holiday of holidays) {
          if (holiday.isHoliday(currentDate)) {
            currentDate.setHoliday();
          }
        }
        if (currentDate.getDay() === 6 && currentDate.holiday !== undefined && !currentDate.holiday) {
          weekReference--;
        }
      }
    } while (!currentDate.equal(startingDate));
  }
  let weekIndex = weekReference % 4;
  if (weekReference < 0) {
    weekIndex = 4 + weekIndex;
  }
  console.log(`Semaine de référence : ${weekReference}`);

  for (let team of teams) {
    team.resetDays();
  }

  currentDate = startingDate.getCopy();
  let lastDate = endingDate.addDays(1);
  do {
    currentDate.setHoliday(false);
    for (let holiday of holidays) {
      if (holiday.isHoliday(currentDate)) {
        currentDate.setHoliday();
      }
    }
    // TODO: ajouter les jours fériés
    if (currentDate.getDay() === 1 && !currentDate.holiday && !currentDate.equal(dateReference)) {
      weekIndex++;
      // console.log("Nouvelle semaine");
      console.log("Référence : " + weekIndex);
      console.log("Jour : " + currentDate);
    }
    for (let team of teams) {
      team.addDay(currentDate, weekIndex);
    }
    currentDate.addOneDay();
  } while (!currentDate.equal(lastDate));
}

document.addEventListener("DOMContentLoaded", () => {
  initialisation();
});
