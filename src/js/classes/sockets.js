
export async function getHolidays(year = 2024) {
    const baseUrl = new URL("https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records");
    const params = new URLSearchParams({
        limit: '20',
        refine: 'population: "-"',
        refine: 'population: "Élèves"',
        refine: 'location: "Orléans-Tours"',
        refine: `annee_scolaire: "${year}-${year + 1}"`,
        refine: `annee_scolaire: "${year - 1}-${year}"`
    })
    const fetchHolidays = await fetch(`${baseUrl}?${params}`);
    const json = await fetchHolidays.json();
    return json.results;
}