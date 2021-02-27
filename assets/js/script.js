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

