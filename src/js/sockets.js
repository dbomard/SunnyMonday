export { getHolidays, getPublicHolidays }

async function getHolidays() {
    const baseUrl = new URL("https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records");
    const params = new URLSearchParams();
    params.append("limit", '100');
    params.append("refine", 'population:"-"');
    params.append("refine", 'population:"Élèves"');
    params.append("refine", 'location:"Orléans-Tours"');
    const result = await fetch(`${baseUrl}?${params.toString()}`);
    const holidays = await result.json();
    return holidays.results;
}

async function getPublicHolidays(year = 2024) {
    const response = await fetch(
        `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`
    );
    return response.text();
}