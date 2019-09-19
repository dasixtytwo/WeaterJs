var APPID = "16351eb1dae61de4eb9e3c089f64266b";
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;

function updateByCityAndCountry(cityName) {
  var url = "http://api.openweathermap.org/data/2.5/weather?" +
    "q=" + cityName +
    "&APPID=" + APPID;
  sendRequest(url);
}

function updateByGeo(lat, lon) {
  var url = "http://api.openweathermap.org/data/2.5/weather?" +
  "lat=" + lat +
  "&lon=" + lon +
  "&APPID=" + APPID;
  sendRequest(url)
}

function sendRequest(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      var data = JSON.parse(xmlhttp.responseText);
      var weather = {};
      weather.icon = data.weather[0].id;
      weather.humidity = data.main.humidity;
      weather.wind = data.wind.speed;
      weather.direction = degreesToDirection(data.wind.deg);
      weather.loc = data.name;
      weather.temp = KtoC(data.main.temp);
      update(weather);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function degreesToDirection(degree) {
  var range = 360/16;
  var low = 360 - range/2;
  var high = (low + range) % 360;
  var angles = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", " SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  for( i in angles ) {
    if(degree >= low && degree < high)
      return angles[i];

    low = (low + range) % 360;
    high = (high + range) % 360;
  }
  return degree;
}

/**
 * @return {number}
 */
function KtoC(k) {
  return Math.round(k - 273.15);
}

/**
 * @return {number}
 */
function KtoF(k) {
  return Math.round(k*(9/5)-459.67);
}

function update(weather) {
  temp.innerHTML = weather.temp;
  loc.innerHTML = weather.loc;
  icon.src = "img/codes/" +  weather.icon + ".png";
  humidity.innerHTML = weather.humidity;
  wind.innerHTML = weather.wind;
  direction.innerHTML = weather.direction;
  //console.log();
}

function showPosition(position) {
  updateByGeo(position.coords.latitude, position.coords.longitude);
}

window.onload = function () {
  temp = document.getElementById("temperature");
  loc = document.getElementById("location");
  icon = document.getElementById("icon");
  humidity = document.getElementById("humidity");
  wind = document.getElementById("wind");
  direction = document.getElementById("direction");

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    var cityName = window.prompt("Could not discover your city,Typing your city and your Country, eg. 'Glasgow,uk'");
    //var countryName = window.prompt("Could not discover your city, What is your city");
    updateByCityAndCountry(cityName);
  }
};
