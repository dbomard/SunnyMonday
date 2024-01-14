export { getHolidays, getPublicHolidays }

async function getHolidays(year = 2024) {
    const baseUrl = new URL("https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records");
    const params = new URLSearchParams({
        limit: '20',
        refine: 'population: "-"',
        refine: 'population: "Élèves"',
        refine: 'location: "Orléans-Tours"',
        refine: `annee_scolaire: "${year}-${year + 1}"`,
        refine: `annee_scolaire: "${year - 1}-${year}"`
    })
    const result = await fetch(`${baseUrl}?${params}`);
    const holidays = await result.json();
    return holidays.results;
}

async function getPublicHolidays(year = 2024) {
    const response = await fetch(
        `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`
    );
    return response.text();
}