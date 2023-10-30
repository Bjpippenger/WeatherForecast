$(document).ready(function () {
  const form = $("#search-form");
  const cityInput = $("#city-input");
  const currentWeather = $("#current-weather");
  const forecast = $("#forecast");
  const searchHistory = $("#search-history");

  form.on("submit", function (event) {
    event.preventDefault();
    const city = cityInput.val();
    getWeather(city);
  });

  function getWeather(city) {
    const apiKey = "9aed30404aaaa0c3d4d478f40caddf47";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&limit=5`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const cityName = data.name;
        const temperature = convertKelvinToFahrenheit(data.main.temp);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        currentWeather.html(`
          <div class="current-day">
            <h2>${cityName}</h2>
            <p>Current Temperature: ${temperature}°F</p>
          </div>
          <div class="current-details">
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
          </div>
        `);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&limit=5`;

    fetch(forecastApiUrl)
      .then((response) => response.json())
      .then((data) => {
        const forecastItems = data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );

        forecast.empty();

        forecastItems.forEach((item) => {
          const date = item.dt_txt.split(" ")[0];
          const temperature = convertKelvinToFahrenheit(item.main.temp);
          const humidity = item.main.humidity;
          const windSpeed = item.wind.speed;

          forecast.append(`
            <div class="forecast-item">
              <h3>${date}</h3>
              <p>Temperature: ${temperature}°F</p>
              <p>Humidity: ${humidity}%</p>
              <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
          `);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const searchItem = $("<div>").text(city).addClass("search-item");

    searchHistory.append(searchItem);

    searchItem.on("click", function () {
      getWeather(city);
    });
  }

  function convertKelvinToFahrenheit(kelvin) {
    return (((kelvin - 273.15) * 9) / 5 + 32).toFixed(2);
  }
});
//9aed30404aaaa0c3d4d478f40caddf47
