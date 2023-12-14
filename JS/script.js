document.querySelector("#btnSearch").addEventListener("click", () => {
  let text = document.querySelector("#txtSearch").value;
  document.querySelector("#details").style.display = "none";
  document.querySelector(".info").style.display = "none";

  document.querySelector(".center").style.opacity = 1;

  getCountry(text);
});

let input = document.querySelector("#txtSearch");
input.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    document.querySelector("#btnSearch").click();
  }
});

document.querySelector("#btnLocation").addEventListener("click", () => {
  if (navigator.geolocation) {
    document.querySelector(".info").style.display = "none";
    document.querySelector(".center").style.opacity = 1;

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
});

function onError(err) {
  console.log(err);
  document.querySelector(".center").style.opacity = 0;
}

async function onSuccess(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;

  const api_key = "0b7017efc3584532bff1f5eb1f1a63d0";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`;

  const response = await fetch(url);
  const data = await response.json();

  const country = data.results[0].components.country;
  document.querySelector("#txtSearch").value = country;
  document.querySelector("#btnSearch").click();
  document.querySelector("#txtSearch").value = "";
}

async function getCountry(country) {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/name/" + country
    );

    if (!response.ok) throw new Error("Ülke bulunamadı.");
    const data = await response.json();
    renderCountry(data[0]);
    console.log(data);
    const countries = data[0].borders;
    if (!countries) throw new Error("Komşu ülke bulunamadı.");

    const response2 = await fetch(
      "https://restcountries.com/v3.1/alpha?codes=" + countries.toString()
    );

    const neighbors = await response2.json();

    renderNeighbors(neighbors);
  } catch (err) {
    renderError(err);
  }
}

function renderCountry(data) {
  document.querySelector("#txtSearch").value = "";

  document.querySelector(".info").style.display = "none";
  document.querySelector("#details").style.display = "block";

  document.querySelector(".center").style.opacity = 0;

  document.querySelector("#country-details").innerHTML = "";
  document.querySelector("#neighbors").innerHTML = "";

  let html = `
             <div class="col-4">
                <img src="${data.flags.png}" alt="" class="img-fluid" />
              </div>
              <div class="col-8">
                <h3 class="card-title">${data.name.common}</h3>
                <hr />

                <div class="row">
                  <div class="col-4">Nüfus:</div>
                  <div class="col-8">${(data.population / 1000000).toFixed(
                    1
                  )} milyon</div>
                </div>
                <div class="row">
                  <div class="col-4">Resmi Dil:</div>
                  <div class="col-8">${Object.values(data.languages)}</div>
                </div>
                <div class="row">
                  <div class="col-4">Başkent:</div>
                  <div class="col-8">${data.capital[0]}</div>
                </div>
                <div class="row">
                  <div class="col-4">Para Birimi:</div>
                  <div class="col-8">${
                    Object.values(data.currencies)[0].name
                  } (${Object.values(data.currencies)[0].symbol})</div>
                </div>
              </div> 

  `;

  document.querySelector("#details").style.display = "block";
  document.querySelector("#country-details").innerHTML = html;
}

function renderNeighbors(data) {
  let html = "";

  for (let country of data) {
    html += `
            <div class="col-2" style="cursor: pointer;" onclick= "getCountry('${country.name.common}')">
                <div class="card">
                  <img src="${country.flags.png}" class="card-img-top" />
                  <div class="card-body">
                    <h6 class="card-title">${country.name.common}</h6>
                  </div>
                </div>
              </div> 
    
    `;
  }

  document.querySelector("#neighbors").innerHTML = html;
}

function renderError(err) {
  document.querySelector(".center").style.opacity = 0;

  const html = `   
      <div class="alert">
            ${err.message}
      </div>
`;
  setTimeout(function () {
    document.querySelector("#errors").innerHTML = "";
    document.querySelector("#errors").classList.remove("active");
  }, 3000);
  document.querySelector("#errors").classList.add("active");
  document.querySelector("#errors").innerHTML = html;
}
