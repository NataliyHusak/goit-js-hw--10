import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// обробник події вводу в поле пошуку
searchBox.addEventListener('input', debounce(onSearch, 300));

// функція для відображення списку країн
function renderCountries(countries) {
  countryList.innerHTML = '';
  countries.forEach(country => {
    const { name, flags } = country;
    const flagImg = `<img src="${flags.svg}" alt="Flag of ${name}" width="60">`;
    const countryItem = document.createElement('li');
    countryItem.classList.add('country-list__item');
    countryItem.innerHTML = `${flagImg} ${name}`;
    countryList.appendChild(countryItem);
  });
}

// функція для відображення інформації про країну
function renderCountryInfo(country) {
  const { name, flags, capital, population, languages } = country;
  const flagImg = `<img src="${flags.svg}" alt="Flag of ${name}" width="200">`;
  const languagesList = languages.map(lang => lang.name).join(', ');
  countryInfo.innerHTML = `
    <div class="country-info__flag">${flagImg}</div>
    <div class="country-info__details">
      <h2 class="country-info__name">${name}</h2>
      <p class="country-info__data"><span>Capital:</span> ${capital}</p>
      <p class="country-info__data"><span>Population:</span> ${population}</p>
      <p class="country-info__data"><span>Languages:</span> ${languagesList}</p>
    </div>
  `;
}

// головна функція для пошуку країн
async function onSearch() {
  const searchQuery = searchBox.value.trim();
  if (searchQuery === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  try {
    const countries = await fetchCountries(searchQuery);
    if (countries.length > 10) {
      Notiflix.Notify.warning(
        'Too many matches found. Please enter a more specific name.'
      );
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    } else if (countries.length > 1) {
      renderCountries(countries);
      countryInfo.innerHTML = '';
    } else {
      renderCountryInfo(countries[0]);
      countryList.innerHTML = '';
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}
