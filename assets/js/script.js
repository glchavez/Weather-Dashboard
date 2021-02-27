var currentCity = $("#current").children(".row").children(".city");
var displayedDate = $("#current").children(".row").children(".date");
var currentWeatherIcon = $("#current-icon");
var currentTemp = $("#current").children(".temperature");
var currentHumidity = $("#current").children(".humidity");
var currentWind = $("#current").children(".wind-speed");
var currentUVI = $(".uvi");

// Coordinate variables to link city name from current city API to forecast API
var lonCoordinates = "";
var latCoordinates = "";

// Populates last searched city when page is reloaded
if (localStorage.getItem("city")) {
    createSearchHistory(localStorage.getItem("city"));
} else {
    console.log("No previous search history")
};

// Populates the current day weather information
function currentWeatherData(cityName) {

    clearCurrent();

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=d98badc946d5bab20021e4552ce1d082')

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            var searchedCity = data.name;
            currentCity.append(searchedCity);

            var currentDate = data.dt;
            convertDate(currentDate);

            var iconCode = data.weather[0].icon;
            var iconURL = 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png';
            currentWeatherIcon.attr("src", iconURL);

            var searchedTemp = data.main.temp;
            currentTemp.append(searchedTemp + " °F");

            var searchedHumidity = data.main.humidity;
            currentHumidity.append(searchedHumidity + "%");

            var searchedWind = data.wind.speed;
            currentWind.append(searchedWind + " MPH");

            var searchedLonCoor = data.coord.lon;
            lonCoordinates = searchedLonCoor;

            var searchedLatCoor = data.coord.lat;
            latCoordinates = searchedLatCoor;

            getForecastWeather();
        });

};

// Search button to retrieve both current and forecast weather information of searched city
$("#city-search").on("click", function getCurrentWeather(event) {

    clearCurrent();
    event.preventDefault();

    var cityName = $("#city-name").val();

    localStorage.setItem("city", cityName);
    createSearchHistory(cityName);

    currentWeatherData(cityName);
});

// Populates the forecast weather information
function getForecastWeather() {

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latCoordinates + '&lon=' + lonCoordinates + '&exclude=minutely,hourly,alerts&units=imperial&appid=519f87e1804e397b8b29deaf887fdfc3')

        .then(function (response) {
            return response.json();
        })
        .then(function (forecastData) {
            console.log(forecastData);

            var searchedUVI = forecastData.current.uvi;

            if (searchedUVI <= 2) {
                currentUVI.addClass("green").removeClass("yellow red");
            } else if (searchedUVI > 2 && searchedUVI < 8) {
                currentUVI.addClass("yellow").removeClass("green red");
            } else if (searchedUVI >= 8) {
                currentUVI.addClass("red").removeClass("green yellow");
            };

            currentUVI.append(searchedUVI);

            for (i = 1; i < 6; i++) {

                // Convert forecast weather data date to a more readable format
                var forecastDate = $("#forecast-block-" + [i]).children(".forecast-date");
                forecastDate.text("");
                var forecastDateData = forecastData.daily[i].dt;
                var date = new Date(forecastDateData * 1000);
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();
                var convertedForecastDate = month + "/" + day + "/" + year;
                forecastDate.append(convertedForecastDate);

                var forecastIcon = $("#forecast-block-" + [i]).children(".forecast-icon");
                var forecastIconData = forecastData.daily[i].weather[0].icon;
                var forecastIconURL = 'http://openweathermap.org/img/wn/' + forecastIconData + '@2x.png';
                forecastIcon.attr("src", forecastIconURL);

                var forecastTemp = $("#forecast-block-" + [i]).children(".temperature");
                forecastTemp.text("Temp: ");
                var forecastTempData = forecastData.daily[i].temp.day;
                forecastTemp.append(forecastTempData + " °F");

                var forecastHumidity = $("#forecast-block-" + [i]).children(".humidity");
                forecastHumidity.text("Humidity: ");
                var forecastHumidityData = forecastData.daily[i].humidity;
                forecastHumidity.append(forecastHumidityData + "%");

            };
        });
};

// Clears information in the current weather slots, making them ready for the next searched city
function clearCurrent() {

    currentCity.text("");
    displayedDate.text("");
    currentTemp.text("Temperature: ");
    currentHumidity.text("Humidity: ");
    currentWind.text("Wind Speed: ");
    currentUVI.text("");
};

// Saves the last searched city name to be used for the history section when page is reloaded
function createSearchHistory(city) {

    var historyBtn = $("<button>", { "class": "col-sm-12 btn btn-outline-secondary" }).text(city);
    $("#historySearchBtn").prepend(historyBtn);
};

// Populates weather for last searched city when button is clicked
$("#historySearchBtn").click(function (event) {

    currentWeatherData(event.target.textContent)
});

