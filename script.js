// 🌤️ Weather App - Script

const apiKey = "f0b74ae8c30791db4fe601b6a2f5a1fa"; // Replace with your OpenWeatherMap API Key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const weatherInfo = document.getElementById("weatherInfo");
const errorMsg = document.getElementById("errorMsg");

const cityName = document.getElementById("city");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

// Function to Fetch Weather Data
async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError();
  }
}

// Function to Display Weather Data (Upgraded)
function displayWeather(data) {
  errorMsg.classList.add("hidden");
  weatherInfo.classList.remove("hidden");

  const { name } = data;
  const { icon, description: desc, main } = data.weather[0];
  const { temp, feels_like, humidity: hum } = data.main;
  const { speed } = data.wind;

  cityName.textContent = name;
  temperature.textContent = `${Math.round(temp)}°C`;
  description.textContent = desc;
  let emoji = "🌤️";
   if (feels_like > 35) emoji = "🔥";
   else if (feels_like < 10) emoji = "❄️";
   else if (feels_like < 20) emoji = "☁️";
   else emoji = "🌤️";

  feelsLike.textContent = `${Math.round(feels_like)}°C ${emoji}`;

  humidity.textContent = `${hum}%`;
  wind.textContent = `${speed} km/h`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // 🌈 Change Background According to Weather
  const body = document.body;

  switch (main.toLowerCase()) {
    case "clear":
      body.style.background = "linear-gradient(135deg, #f9d423, #ff4e50)";
      break;
    case "clouds":
      body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      break;
    case "rain":
    case "drizzle":
      body.style.background = "linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)";
      break;
    case "thunderstorm":
      body.style.background = "linear-gradient(135deg, #141E30, #243B55)";
      break;
    case "snow":
      body.style.background = "linear-gradient(135deg, #E0EAFC, #CFDEF3)";
      break;
    case "mist":
    case "fog":
    case "haze":
      body.style.background = "linear-gradient(135deg, #3E5151, #DECBA4)";
      break;
    default:
      body.style.background = "linear-gradient(135deg, #74ebd5, #ACB6E5)";
      break;
  }
}

// 📅 5-Day Forecast Function
async function getForecast(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    displayForecast(data);
  } catch (error) {
    console.log("Forecast fetch failed:", error);
  }
}

// Function to Display 5-Day Forecast
function displayForecast(data) {
  const forecastContainer = document.getElementById("forecastContainer");
  const forecastSection = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  // Filter every 8th item (3-hour interval × 8 = 24h)
  const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

  dailyForecasts.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const icon = day.weather[0].icon;
    const minTemp = Math.round(day.main.temp_min);
    const maxTemp = Math.round(day.main.temp_max);

    const dayCard = `
      <div class="forecast-day">
        <p>${dayName}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
        <p>${minTemp}°C / ${maxTemp}°C</p>
      </div>
    `;
    forecastContainer.insertAdjacentHTML("beforeend", dayCard);
  });

  forecastSection.classList.remove("hidden");
}


// Function to Show Error
function showError() {
  errorMsg.classList.remove("hidden");
  weatherInfo.classList.add("hidden");
}

// Search Button Click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeather(city);
    cityInput.value = "";
  }
});

// Search on Enter Key
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// 📍 Auto-Detect User Location
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showErrorMsg);
  } else {
    console.log("Geolocation not supported by browser.");
  }
});

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherByCoordinates(lat, lon);
}

function showErrorMsg() {
  console.log("Unable to access your location.");
}

// 🌎 Fetch weather using coordinates
async function getWeatherByCoordinates(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);

  } catch (error) {
    showError();
  }
}
