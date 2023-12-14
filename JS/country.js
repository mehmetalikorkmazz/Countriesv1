const countriesContainer = document.querySelector(".countries-container");
const filterByRegion = document.querySelector(".filter-by-region");
const searchInput = document.querySelector("#txtSearch");

let allCountries;

async function getCountries() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  renderCountries(data);
  allCountries = data;
}

filterByRegion.addEventListener("change", async (e) => {
  const response3 = await fetch(
    `https://restcountries.com/v3.1/region/${filterByRegion.value}`
  );
  const data = await response3.json();
  renderCountries(data);
});
getCountries();

function renderCountries(data) {
  countriesContainer.innerHTML = "";
  data.forEach((country) => {
    const countryCard = document.createElement("div");
    countryCard.classList.add("country-card");
    countryCard.innerHTML = `
        <img src="${country.flags.svg}" alt="${country.name.common} flag" />
        <div class="card-text">
          <h3 class="card-title">${country.name.common}</h3>
          <p><b>Nüfus: </b>${(country.population / 1000000).toFixed(
            1
          )} milyon</p>
          <p><b>Bölge: </b>${country.region}</p>
          <p><b>Başkent: </b>${country.capital?.[0]}</p>
        </div>

        `;
    countriesContainer.append(countryCard);
  });
}

searchInput.addEventListener("input", (e) => {
  const filteredCountries = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
  );
  renderCountries(filteredCountries);
});
