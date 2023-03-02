// функція для здійснення запиту на бекенд
export default async function fetchCountries(searchQuery) {
  const response = await fetch(
    `https://restcountries.com/v2/name/${searchQuery}`
  );
  if (!response.ok) {
    throw new Error('Oops, there is no country with that name');
  }
  const countries = await response.json();
  return countries;
}
