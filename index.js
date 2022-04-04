const week = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const formatDate = () => {
  let currSeconds = new Date().getMinutes();
  let currHours = new Date().getHours();
  let currWeekDay = week[new Date().getDate()];

  if (currHours < 10) {
    currHours = `0${currHours}`;
  }
  if (currSeconds < 10) {
    currSeconds = `0${currSeconds}`;
  }
  return `${currWeekDay}, ${currHours} : ${currSeconds}`;
};
let currenttime = document.querySelector(".main-date-time");
currenttime.innerHTML = formatDate();

//celcius transform logic

let celciusTemp = document.querySelector(".main-celcius");
let farenheitTemp = document.querySelector(".main-farenheit");
let currTempValue = document.querySelector("#temp-value");
let temperaturefromApi = 0;

const convertFarenheit = () => {
  celciusTemp.classList.remove("active");
  farenheitTemp.classList.add("active");
  let updatedFarenheitTemp = (currTempValue.innerHTML * 9) / 5 + 32;
  currTempValue.innerHTML = `${updatedFarenheitTemp}`;
};

const convertCelcius = () => {
  farenheitTemp.classList.remove("active");
  celciusTemp.classList.add("active");
  currTempValue.innerHTML = `${temperaturefromApi}`;
};

//Event Lisners for Farenheit and Celcius
farenheitTemp.addEventListener("click", convertFarenheit);
celciusTemp.addEventListener("click", convertCelcius);

// if (weather[inputCity]) {
//   let celciusTemp = Math.round(weather[inputCity].temp);
//   let humidityValue = weather[inputCity].humidity;
//   let farenheitTemp = (celciusTemp * 9) / 5 + 32;
// } else {
// }

// const buttonSearch = document.querySelector(".header-btn");
// buttonSearch.addEventListener("click", searchCity);

// const searchCity = () => {
//   console.log(inputCity, weather["${inputCity}"]);
//   let temp = weather["${inputCity}"].temp;
//   let farenheitTemp = (temp * 9) / 5 + 32;
//   alert(
//     `It is currently ${temp}°C (${farenheitTemp}°F) in ${inputCity} with a humidity of 80%`
//   );
// };

// axios
//   .get("https://jsonplaceholder.typicode.com/comments/")
//   .then((res) => console.log(res.data[0].email));

//Task 2
// const APIKey = "80374f039ac77c49488d6b98bd64b1ff";
// let city = "Sydney";
// const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;

// axios.get(`${APIUrl}&appid=${APIKey}`).then((res) => {
//   let temperaturefromApi = Math.round(res.data.main.temp);
//   console.log(temperaturefromApi);
// });

//data
const APIKey = "80374f039ac77c49488d6b98bd64b1ff";
const temperatureOnUI = document.querySelector("#temp-value");
let inputCity = document.querySelector(".header-select");
let cityText = document.querySelector(".main-city");
let form = document.querySelector("#city-form");
let humidityElement = document.querySelector("#main-humidity");
let windElement = document.querySelector("#main-wind");
let iconElement = document.querySelector("#main-icon");
let forecastElement = document.querySelector("#forecast");

//add dynamically forecast days
function displayForecast(arrWeeklyTempFromApi) {
  let forecast = arrWeeklyTempFromApi;
  console.log(forecast, "received");

  let forecastHTML = `<ul>`;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  days.forEach((el, i) => {
    forecastHTML =
      forecastHTML +
      ` <li>
              <h5 class="weather-forecast-date">${el}</h5>
              <div>
                <small class="weather-forecast-max">12°</small>
                <small class="weather-forecast-min">16°</small>
              </div>
              <img
                width="50"
                src="https://bmcdn.nl/assets/weather-icons/v2.1/fill/clear-day.svg"
                alt="Good Sunny Weather"
              />
               </li>`;
  });
  forecastHTML = forecastHTML + `</ul>`;
  forecastElement.innerHTML = forecastHTML;
}
//getting forecastWeekly from API
function getWeekForecast(coordinates) {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${APIKey}&units=metric`
    )
    .then(displayForecast);
}

// displayForecast();
//change this logic to happen when click on btn #header-curr-btn
const currentBtn = document.querySelector("#header-curr-btn ");
const showCurrentTemperatureAndCity = (e) => {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`
      )
      .then((response) => {
        const temperature = Math.round(response.data.main.temp);
        temperatureOnUI.innerHTML = `${temperature}`;
      });
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${APIKey}`
      )
      .then((res) => {
        let city = res.data[0].name;
        const header = document.querySelector(".main-city");
        header.innerHTML = `${city}`;
      });
  });
};

currentBtn.addEventListener("click", showCurrentTemperatureAndCity);
//Connect search input with API
form.addEventListener("submit", (e) => {
  e.preventDefault();
  cityText.innerHTML = `${inputCity.value}`;
});
//pressing Search btn
// const WeatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&units=metric`;
const searchBtn = document.querySelector(".header-btn");
const displayTemperature = (e) => {
  let cityFromInput = inputCity.value;
  e.preventDefault();
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&units=metric&appid=${APIKey}`
    )
    .then((res) => {
      temperaturefromApi = Math.round(res.data.main.temp);
      cityText.innerHTML = `${inputCity.value}`;
      temperatureOnUI.innerHTML = `${temperaturefromApi}`;
      humidityElement.innerHTML = `Humidity: ${res.data.main.humidity}%`;
      windElement.innerHTML = `Wind: ${res.data.wind.speed}Km`;
      //iconChange
      console.log(res.data.weather[0].description);
      iconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`
      );
      iconElement.setAttribute("alt", res.data.weather[0].description);
      //updating weekly forecast
      getWeekForecast(res.data.coord);
    });
};
// searchBtn.addEventListener("submit", findTempreratureAndCityApi);
form.addEventListener("submit", displayTemperature);
