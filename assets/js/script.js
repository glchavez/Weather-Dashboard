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
