import { Team } from "./classes/team.js";
import { Holiday } from "./classes/holiday.js";
import { weekTypes } from "./week.js";
import { getHolidays } from "./sockets.js";
import { Color } from "./classes/color.js";
import "./dateUtils.js";
import "./colorUtils.js";

// const currentYear = new Year();

/**@type {Array.<Team>} teams */
const teams = new Array(5);

/**@type {Date} dateReference - Date de référence pour le calcul des semaines */
var dateReference = new Date("2024-09-02T00:00:00Z");
dateReference.setHours(0, 0, 0, 0);

/**@type {Array.<Holiday>} holidays */
const holidays = new Array();

/**@type {Array.<Holiday>} currentHolidays*/
const currentHolidays = new Array();

/**@type {Array.<Date>} publicDays */
var publicDays = new Array();


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

/**
  * @returns Date de Pâques
  */
function getEasterDate(year) {
  let B = 19 * (year % 19) + 24;
  let M = B % 30;
  let C = 2 * (year % 4) + 4 * (year % 7) + 6 * M + 5;
  let N = C % 7;
  let P = M + N;
  let easter = `${year}-03-${P + 22}`;
  if (P > 9) {
    easter = `${year}-04-${P - 9}`;
  }
  return new Date(easter);
}

/**
 * Calcul les jours fériés
 */
function computePublicHolidays(year) {
  let saturdays = document.querySelector('#saturdays').checked;

  let day = new Date(`${year}-01-01`);
  day.publicDay = true;
  day.setPublicDayName("1er janvier");
  publicDays.push(day);

  let easter = getEasterDate(year);
  easter.publicDay = true;
  easter.setPublicDayName("Pâques");
  publicDays.push(easter);

  if (saturdays === true) {
    day = easter.subDays(1);
    day.publicDay = true;
    day.setPublicDayName("Samedi de Pâques");
    publicDays.push(day);
  }

  day = easter.addDays(1)
  day.publicDay = true;
  day.setPublicDayName("Lundi de Pâques");
  publicDays.push(day);

  day = new Date(`${year}-05-01`)
  day.publicDay = true;
  day.setPublicDayName("Fête du travail");
  publicDays.push(day);

  day = new Date(`${year}-05-08`)
  day.publicDay = true;
  day.setPublicDayName("Victoire 1945");
  publicDays.push(day);

  day = easter.addDays(39)
  day.publicDay = true;
  day.setPublicDayName("Ascension");
  publicDays.push(day);

  day = easter.addDays(49)
  day.publicDay = true;
  day.setPublicDayName("Pentecôte");
  publicDays.push(day);

  // Le samedi de Pentecôte est posé sur les CA
  /*if (saturdays === true) {
    day = easter.addDays(48);
    day.publicDay = true;
    day.setPublicDayName("Samedi de la Pentecôte");
    publicDays.push(day);
  }*/

  day = easter.addDays(50)
  day.publicDay = true;
  day.setPublicDayName("Lundi de Pentecôte");
  publicDays.push(day);

  day = new Date(`${year}-07-14`)
  day.publicDay = true;
  day.setPublicDayName("Fête Nationale");
  publicDays.push(day);

  day = new Date(`${year}-08-15`)
  day.publicDay = true;
  day.setPublicDayName("Assomption");
  publicDays.push(day);

  day = new Date(`${year}-11-01`)
  day.publicDay = true;
  day.setPublicDayName("Toussaint");
  publicDays.push(day);

  day = new Date(`${year}-11-11`)
  day.publicDay = true;
  day.setPublicDayName("Armistice 1918");
  publicDays.push(day);

  day = new Date(`${year}-12-25`)
  day.publicDay = true;
  day.setPublicDayName("Noël");
  publicDays.push(day);
}

async function initialisation() {
  // Création des équipes
  fetch('./src/js/config.json')
    .then(response => {
      return response.json;
    })
    .then(response => {
      console.log(response);
    })
  // let color = new Color("#B3ffB3");
  // teams[0] = new Team(
  //   "Verte",
  //   [weekTypes.typeA, weekTypes.typeB, weekTypes.typeC, weekTypes.typeD],
  //   color
  // );
  // color = new Color("#ffB3B3");
  // teams[1] = new Team(
  //   "Rouge",
  //   [weekTypes.typeB, weekTypes.typeC, weekTypes.typeD, weekTypes.typeA],
  //   color
  // );
  // color = new Color("#ffffB3");
  // teams[2] = new Team(
  //   "Jaune",
  //   [weekTypes.typeC, weekTypes.typeD, weekTypes.typeA, weekTypes.typeB],
  //   color
  // );
  // color = new Color("#B3ffff");
  // teams[3] = new Team(
  //   "Bleue",
  //   [weekTypes.typeD, weekTypes.typeA, weekTypes.typeB, weekTypes.typeC],
  //   color
  // );
  // teams[4] = new Team("Mediathèque", [weekTypes.open]);

  // Création de la liste des vacances
  await getHolidays()
    .then((results) => {
      for (let holiday of results) {
        if (holiday.description === "Vacances d'Été") {
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

      let minDate = holidays[0].startingDate.toISOString().substring(0, 4) + "-01-01";
      let maxDate = holidays
        .slice(-1)[0]
        .endingDate.toISOString()
        .substring(0, 4) + "-12-31";

      startingDateElt.max = maxDate;
      startingDateElt.min = minDate;
      endingDateElt.max = maxDate;
      endingDateElt.min = minDate;

      // Jours fériés
      for (let year = parseInt(minDate.substring(0, 4)); year <= parseInt(maxDate.substring(0, 4)); year++) {
        computePublicHolidays(year);
      }

      const evt = new Event("change");
      startingDateElt.addEventListener("change", changeInterval);
      endingDateElt.addEventListener("change", changeInterval);
      startingDateElt.dispatchEvent(evt);

      let saturdays = document.querySelector('#saturdays');
      saturdays.addEventListener('change', checkSaturdays);

      let dateReferenceRadio = document.querySelector('#chooseReferenceDate');
      dateReferenceRadio.addEventListener('change', (e) => {
        console.log(e.target.value);
        switch (e.target.value) {
          case "referenceJanuary":
            dateReference = new Date('2025-01-06T00:00:00Z')
            break;
          case "referenceSeptembre":
            dateReference = new Date('2024-09-02T00:00:00Z');
            break;
        }
        const evt = new Event("change");
        let startingDateElt = document.querySelector("#startingDate");
        startingDateElt.dispatchEvent(evt);

      })
    });
}

function checkSaturdays() {
  publicDays = [];

  let minDate = holidays[0].startingDate.toISOString().substring(0, 10);
  let maxDate = holidays
    .slice(-1)[0]
    .endingDate.toISOString()
    .substring(0, 10);

  for (let year = parseInt(minDate.substring(0, 4)); year <= parseInt(maxDate.substring(0, 4)); year++) {
    computePublicHolidays(year);
  }
  const evt = new Event("change");
  let startingDateElt = document.querySelector("#startingDate");
  startingDateElt.dispatchEvent(evt);
}

function changeInterval(e) {
  let startingDateElt = document.querySelector("#startingDate");
  let endingDateElt = document.querySelector("#endingDate");

  if (startingDateElt.value === "" || endingDateElt.value === "") {
    e.currentTarget.classList.add("is-invalid");
    e.preventDefault();
    return;
  }
  e.currentTarget.classList.remove("is-invalid");


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

  // La date de début est toujours supérieure à la date des premières vacances
  // et la date de fin est toujours supérieure à la date des dernières vacances
  if (startingDate < holidays[0].startingDate) {
    startingDate = holidays[0].startingDate.getCopy();
    startingDateElt.value = startingDate.toISOString().substring(0, 10);
  }
  if (endingDate > holidays.slice(-1).endingDate) {
    endingDate = holidays.slice(-1).endingDate.getCopy();
    endingDateElt.value = endingDate.toISOString().substring(0, 10);
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
  // Faire disparaître l'instruction de cliquer sur une équipe
  let instructions = document.querySelector("#team-detail p");
  instructions.classList.add("hidden");

  let teamRow = event.currentTarget;
  let teamCheckbox = teamRow.querySelector('input');
  if (teamCheckbox.checked) {
    event.preventDefault();
    teamCheckbox.checked = false;
    resetCalendar();
    return;
  }

  // Raz de toutes les coches
  for (let check of document.querySelectorAll('.teamCheckbox')) {
    check.checked = false
  }

  // Cocher la ligne cliquée
  teamCheckbox.checked = true;

  // Récupération de l'index de l'équipe
  let teamIndex = event.currentTarget.id.substring(4);
  let team = teams[teamIndex];
  console.log("Equipe cliquée: " + teamIndex);
  drawCalendar(team);
}

function drawCalendar(team) {
  // RAZ zone du calendrier
  let calendar = document.querySelector("#calendar");
  calendar.innerHTML = "";

  // Ajout du template de calendrier
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
  let currentYear = -1;
  let currentRaw = undefined;
  let colorHsl = team.color.getHsl();
  for (let day of team.days) {
    if (day.getMonth() !== currentMonth) {
      if (currentRaw !== undefined) {
        // Ajout du mois précédent au tableau si défini
        tableBody.appendChild(currentRaw);
      }
      // Changement de mois
      currentMonth = day.getMonth();
      currentRaw = document.createElement("tr");

      let thElt = document.createElement('th');
      if (day.getFullYear() !== currentYear) {
        thElt.rowSpan = `${12 - day.getMonth()}`;
        // Changement d'année
        currentYear = day.getFullYear();
        thElt.innerText = currentYear;
        currentRaw.appendChild(thElt);
      }

      thElt = document.createElement("th");
      thElt.innerText = day.toLocaleDateString("fr-FR", { month: 'long' });

      currentRaw.appendChild(thElt);
      // Ajout d'un espace si on ne commence pas au 1er du mois
      if (day.getDate() !== 1) {
        let tdElt = document.createElement('td');
        tdElt.colSpan = day.getDate() - 1;
        currentRaw.appendChild(tdElt);
      }
    }
    let tdElt = document.createElement("td");
    tdElt.innerText = day.toLocaleDateString("fr-FR", { weekday: 'narrow' });
    if (day.getHoliday()) {
      tdElt.classList.add('holiday');
    }
    if (day.getWeekend()) {
      tdElt.style.backgroundColor = `hsl(${colorHsl.h}, ${Math.round(colorHsl.s / 2)}%, ${Math.round(colorHsl.l / 1.3)}%)`;
    } else {
      tdElt.style.backgroundColor = team.color.getHex();
    }
    if (day.getPublicDay()) {
      tdElt.style.backgroundColor = `hsl(${colorHsl.h}, ${Math.round(colorHsl.s / 2)}%, ${Math.round(colorHsl.l / 2)}%)`;
      tdElt.style.color = `hsl(${colorHsl.h}, ${colorHsl.s}%, 90%)`;

      tdElt.title = day.getPublicDayName();
    }
    currentRaw.appendChild(tdElt);

    // Ajout du dernier mois
    if (currentRaw !== undefined) {
      tableBody.appendChild(currentRaw);
    }
  }
}

function updateTeamsSection() {
  // MAJ Affichage
  let table = document.querySelector("#table-teams");
  //Sauvegarde de l'équipe cochée
  let checkedId = undefined;
  for (let row of table.querySelectorAll("tr")) {
    if (row.querySelector('.teamCheckbox').checked) {
      checkedId = row.id;
    }
  }

  // RAZ zone calendrier
  table.innerHTML = "";
  teams.forEach((team, index) => {
    let newRow = document.createElement("tr");
    newRow.id = `team${index}`;
    newRow.style.backgroundColor = team.color.getHex();
    newRow.innerHTML = `
      <td><input class="form-check-input teamCheckbox" type="checkbox" id="team${team.name}" disabled /></td>
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

  // Restauration coche
  if (checkedId !== undefined) {
    const evt = new Event("click");
    table.querySelector(`#${checkedId}`).dispatchEvent(evt);
  }
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
        currentDate.setHoliday(false);
        for (let holiday of holidays) {
          if (holiday.isHoliday(currentDate)) {
            currentDate.setHoliday();
          }
        }
        if (currentDate.getDay() === 1 && currentDate !== dateReference && !currentDate.holiday) {
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
        if (currentDate.getDay() === 6 && currentDate !== dateReference && !currentDate.holiday) {
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
        currentDate.setHoliday(true);
      }
    }
    currentDate.setPublicDay(false);
    for (let publicDay of publicDays) {
      if (currentDate.equal(publicDay)) {
        currentDate.setPublicDay(true);
        currentDate.setPublicDayName(publicDay.getPublicDayName());
      }
    }
    if (currentDate.getDay() === 1 && !currentDate.holiday && !currentDate.equal(dateReference)) {
      weekIndex++;
      // console.log("Nouvelle semaine");
      // console.log("Référence : " + weekIndex);
      // console.log("Jour : " + currentDate);
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
