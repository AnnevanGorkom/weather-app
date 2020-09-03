function removeClass() {
  let weatherClasses = [
    "fa-bolt",
    "fa-cloud-rain",
    "fa-cloud-showers-heavy",
    "fa-snowflake",
    "fa-smog",
    "fa-sun",
    "fa-cloud",
  ];

  return document
    .querySelector("i.today-icon")
    .classList.remove(...weatherClasses);
}

function showWeatherIcon(id) {
  if (id >= 200 && id < 300) {
    return `fa-bolt`;
  } else if (id >= 300 && id < 400) {
    return `fa-cloud-rain`;
  } else if (id >= 500 && id < 600) {
    return `fa-cloud-showers-heavy`;
  } else if (id >= 600 && id < 700) {
    return `fa-snowflake`;
  } else if (id >= 700 && id < 800) {
    return `fa-smog`;
  } else if (id === 800) {
    return `fa-sun`;
  } else if (id >= 801) {
    return `fa-cloud`;
  }
}

function calculateWindForce(speed) {
  let kph = Math.round((speed * 18) / 5);
  return kph;
}

function degreesToCompass(degrees) {
  let directions = [
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
  document.querySelector("#date").innerHTML = createDate(
    response.data.dt * 1000
  );

  document.querySelector(".card-title").innerHTML = response.data.name;

  document.querySelector("h2").innerHTML = Math.round(response.data.main.temp);

  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;

  document.querySelector("#wind-direction").innerHTML = degreesToCompass(
    response.data.wind.deg
  );

  document.querySelector("#wind-force").innerHTML = calculateWindForce(
    response.data.wind.speed
  );

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  removeClass();

  document
    .querySelector("i.today-icon")
    .classList.add(showWeatherIcon(response.data.weather[0].id));

  tempCelcius = response.data.main.temp;
}

function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = null;
  forecastElement.innerHTML = null;

  for (let i = 0; i < 5; i++) {
    forecast = response.data.list[i];
    forecastElement.innerHTML += `
    <li class="list-group-item days-temp">
      <div class="row">
        <div class="col-3">
          <i class="fas ${showWeatherIcon(forecast.weather[0].id)}"></i>
        </div>
        <div class="col-9">
          <p>${formatHours(forecast.dt * 1000)}</p>
          <h4><strong>${Math.round(
            forecast.main.temp_max
          )}</strong>/${Math.round(forecast.main.temp_min)}</h4>
          <p class="degree-type">ºC</p>
        </div>
      </div>
    </li>`;
  }
}

function showOtherLocation(city) {
  let apiKey = "94504fb22392e5a384860fde5e24eca5";
  let metricUnit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metricUnit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${metricUnit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showForecast);
}

function showCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "94504fb22392e5a384860fde5e24eca5";
  let metricUnit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${metricUnit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${metricUnit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showForecast);
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

function createDate(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date(timestamp);
  let day = days[date.getDay()];

  return (timeStamp = `${day}, ${formatHours(timestamp)}`);
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hour = addZero(date.getHours());
  let minute = addZero(date.getMinutes());
  return `${hour}:${minute}`;
}

function switchToFahrenheit(event) {
  event.preventDefault();
  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let tempF = (tempCelcius * 9) / 5 + 32;
  let tempElement = document.querySelector("h2");
  tempElement.innerHTML = Math.round(tempF);
}

function switchToCelcius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celciusLink.classList.add("active");
  let tempElement = document.querySelector("h2");
  tempElement.innerHTML = Math.round(tempCelcius);
}

let tempCelcius = null;

showOtherLocation("Haarlem");

let cityInput = document.querySelector("form");
cityInput.addEventListener("submit", handleSubmit);

let showCurrentCity = document.querySelector("#current-city");
showCurrentCity.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", switchToFahrenheit);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", switchToCelcius);
