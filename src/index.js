function calculateWindForce(speed) {
  let kph = Math.round((speed * 18) / 5);
  return kph;
}

function degreesToCompass(degrees) {
  var directions = [
    "North",
    "North-Northeast",
    "Northeast",
    "East-Northeast",
    "East",
    "East-Southeast",
    "Southeast",
    "South-Southeast",
    "South",
    "South-Southwest",
    "Southwest",
    "West-Southwest",
    "West",
    "West-Northwest",
    "Northwest",
    "North-Northwest",
  ];
  let value = Math.floor(degrees / 22.5 + 0.5);
  return directions[value % 16];
}

function showWeather(response) {
  document.querySelector(".card-title").innerHTML = response.data.name;

  document.querySelector("h2").innerHTML = Math.round(response.data.main.temp);

  let maxTemp = Math.round(response.data.main.temp_max);
  let minTemp = Math.round(response.data.main.temp_min);
  document.querySelector("#max-min-temp").innerHTML = `${maxTemp}/${minTemp}`;

  document.querySelector("#wind-direction").innerHTML = degreesToCompass(
    response.data.wind.deg
  );

  document.querySelector("#wind-force").innerHTML = calculateWindForce(
    response.data.wind.speed
  );

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
}

function showOtherLocation(city) {
  let apiKey = "94504fb22392e5a384860fde5e24eca5";
  let metricUnit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metricUnit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function showCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "94504fb22392e5a384860fde5e24eca5";
  let metricUnit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${metricUnit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentPosition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#new-city-input");
  showOtherLocation(city.value);
}

function addZero(time) {
  if (time < 10) {
    time = "0" + time;
  }
  return time;
}

function createDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];
  let hour = addZero(date.getHours());
  let minute = addZero(date.getMinutes());

  let timeStamp = `${day}, ${hour}:${minute}`;

  let dateHeading = document.querySelector("#date");
  dateHeading.innerHTML = timeStamp;
}

// function switchToCelcius(event) {
//   event.preventDefault();
//   let temp = document.querySelector("h2");
//   temp.innerHTML = `22`;
// }

// function switchToFahrenheit(event) {
//   event.preventDefault();
//   let temp = document.querySelector("h2");
//   temp.innerHTML = `72`;
// }

createDate(new Date());
showOtherLocation("Haarlem");

let cityInput = document.querySelector("form");
cityInput.addEventListener("submit", handleSubmit);

let showCurrentCity = document.querySelector("#current-city");
showCurrentCity.addEventListener("click", getCurrentPosition);

// let tempCelcius = document.querySelector("#celcius-link");
// let tempFahrenheit = document.querySelector("#fahrenheit-link");
// tempCelcius.addEventListener("click", switchToCelcius);
// tempFahrenheit.addEventListener("click", switchToFahrenheit);
