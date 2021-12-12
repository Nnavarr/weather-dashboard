// establish global variables
var searchButtonEl = document.getElementById('search-btn');
var tempEl = document.getElementById('temp');
var windEl = document.getElementById('wind');
var humidityEl = document.getElementById('humidity');
var uvEl = document.getElementById('uv');
var cityTitleEl = document.getElementById('city');

// forecast elements
var day1El = document.getElementById('day1');
var day2El = document.getElementById('day2');
var day3El = document.getElementById('day3');
var day4El = document.getElementById('day4');
var day5El = document.getElementById('day5');

var forecastEl = [day1El, day2El, day3El, day4El, day5El];

var apiKey = '504f46843e11dd1aa60312828047eb5b';
var cityObj = {
    'phoneix': 'arizona',
    'los angeles': 'california', 
    'las vegas': 'nevada',
    'austin': 'texas',
    'houston': 'texas'
}

// api call: current weather
var getWeather = function(){
    // api call based on user input
    var cityName = document.getElementById('city-search').value;
    cityName = cityName.trim().toLowerCase();

    var state = cityObj[cityName];
    var baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${state}&appid=${apiKey}&units=imperial`

    // container for lat long coords
    var lat = 0;
    var lon = 0;

    // current day weather
    fetch(baseUrl).then(function(response){
        response.json().then(function(data) {
            // update html containers to show data
            console.log(data);
            var date = Date(data.dt * 1000);
            cityTitleEl.innerHTML = data.name + ' - ' + date;
            tempEl.innerHTML = tempEl.innerHTML + data.main.temp;
            windEl.innerHTML = windEl.innerHTML + data.wind.speed + ' MPH';
            humidityEl.innerHTML = humidityEl.innerHTML + data.main.humidity + ' %';

            // set lat/long coordinates for forecast API
            lat = data.coord.lat;
            lon = data.coord.lon;

        });
    });

    // 5 day forecast
    getForecastWeather(lat, lon);
    
    // 


}

// api call: 5 day forecast
var getForecastWeather = function(lat, lon){
    // api call based on user input
    var baseUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    console.log(baseUrl);
    // extract forecast data
    fetch(baseUrl).then(function(response){
        response.json().then(function(data) {
            console.log(data);
            
            // update HTML elements with forecast info

            for (var i = 0; i < forecastEl.length; i++){
                // position 0 = next day forecast
                forecastEl[i].children[0].innerHTML = data.daily[i].temp.dt; // date
                forecastEl[i].children[1].innerHTML = data.daily[i].temp.day;
                forecastEl[i].children[2].innerHTML = data.daily[i].wind_speed + ' MPH';
                forecastEl[i].children[3].innerHTML = data.daily[i].humidity + ' %';   
            }

        })
    })
}

// event listeners
searchButtonEl.addEventListener('click', getWeather);

