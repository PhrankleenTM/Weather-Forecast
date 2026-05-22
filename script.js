import CONFIG from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  const menuTab = document.getElementById("menuTab");
  const openMenuBtn = document.getElementById("openMenuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const currentWeatherDetails = document.getElementById("details");
  const weatherForecast = document.getElementById("weatherForecast");
  const searchWeather = document.getElementById("searchWeather");
  const weatherInput = document.getElementById("weatherInput");
  const location = document.getElementById("location");
  const currentDate = document.getElementById("currentDate");
  const currentTemperature = document.getElementById("currentTemperature");
  const currentMain = document.getElementById("currentMain");
  const currentFeels = document.getElementById("currentFeels");
  const currentHumidity = document.getElementById("currentHumidity");
  const currentWind = document.getElementById("currentWind");
  const weatherForecastDate = document.getElementById("weatherForecastDate");
  const forecastTemperature = document.getElementById("forecastTemperature");
  const forecastMain = document.getElementById("forecastMain");
  const forecastWind = document.getElementById("forecastWind");
  const forecastHumidity = document.getElementById("forecastHumidity");

  searchWeather.addEventListener("click", function () {
    const city = weatherInput.value.trim();

    if (!city) {
      alert("Please enter a city name!");
      return;
    }

    fetchCurrentData(city);
    fetchForecastData(city);

    currentWeatherDetails.style.display = "flex";
    weatherForecast.style.display = "flex";
  });

  openMenuBtn.addEventListener("click", function () {
    menuTab.style.display = "flex";
  });

  closeMenuBtn.addEventListener("click", function () {
    menuTab.style.display = "none";
  });

  async function fetchCurrentData(city) {
    try {
      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${CONFIG.API_KEY}`;

      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error(`City not found or API error: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem(`${city}`, JSON.stringify(data));
      console.log(data);

      location.innerHTML = `${data.name}`;
      const date = new Date(data.dt * 1000);
      const shortDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      currentDate.innerHTML = `${shortDate}`;
      currentTemperature.innerHTML = `${data.main.temp}°C`;
      currentMain.innerHTML = `${data.weather[0].main}`;
      currentFeels.innerHTML = `Feels like ${data.main.feels_like}°C`;
      currentHumidity.innerHTML = `Humidity - ${data.main.humidity}%`;
      currentWind.innerHTML = `Wind - ${data.wind.speed} mph`;
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Failed to fetch weather data. Please check the city name.");
    }
  }

  async function fetchForecastData(city) {
    try {
      const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next5days?unitGroup=us&key=${CONFIG.FORECAST_API}`;

      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error(`City not found or API error: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem(`${city}`, JSON.stringify(data));
      console.log(data);

      const forecastDate = new Date(data.days[1].datetime);
      const formatDate = forecastDate.toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        weekday: "short",
        day: "numeric",
      });

      weatherForecastDate.innerHTML = `${formatDate}`;
      forecastTemperature.innerHTML = `${((data.days[1].temp - 32) * (5 / 9)).toFixed(2)}°C`;
      forecastMain.innerHTML = `${data.days[1].conditions}`;
      forecastWind.innerHTML = `${(data.days[1].windspeed / 10).toFixed(2)} mph`;
      forecastHumidity.innerHTML = `Humidity - ${data.days[1].humidity}%`;
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Failed to fetch weather data. Please check the city name.");
    }
  }

  weatherInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchWeather.click();
    }
  });
});
