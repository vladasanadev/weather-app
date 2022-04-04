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

//celcius/farenheit transformation logic
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

//Data + HTML documents
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
  let forecast = arrWeeklyTempFromApi.data.daily;
  console.log(arrWeeklyTempFromApi?.data?.daily, "received");
  let forecastHTML = `<ul>`;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  forecast.forEach((el, i) => {
    if (i < 5) {
      forecastHTML =
        forecastHTML +
        ` <li>
              <h5 class="weather-forecast-date">${days[i]}</h5>
              <div>
                <small class="weather-forecast-max">${Math.round(
                  el.temp.min
                )}°</small>
                <small class="weather-forecast-min">${Math.round(
                  el.temp.max
                )}°</small>
              </div>
              <img
                width="50"
                src=http://openweathermap.org/img/wn/${
                  el.weather[0].icon
                }@2x.png
                alt="Good Sunny Weather"
              />
               </li>`;
    }
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
    .then((res) => {
      displayForecast(res);
      console.log(res, "send data");
    });
}

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
//wrapper fir display temp
const getTemperature = (e) => {
  e.preventDefault();
  displayTemperature(inputCity.value);
};
// let cityFromInput = inputCity.value;
const displayTemperature = (cityFromInput) => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityFromInput}&units=metric&appid=${APIKey}`
    )
    .then((res) => {
      temperaturefromApi = Math.round(res.data.main.temp);
      cityText.innerHTML = `${cityFromInput}`;
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
form.addEventListener("submit", getTemperature);
displayTemperature("Lisbon");
