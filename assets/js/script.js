// establish global variables
var searchButtonEl = document.getElementById('search-btn');
var tempEl = document.getElementById('temp');
var windEl = document.getElementById('wind');
var humidityEl = document.getElementById('humidity');
var uvEl = document.getElementById('uv');

var apiKey = '504f46843e11dd1aa60312828047eb5b';
var cityObj = {
    'phoneix': 'arizona',
    'los angeles': 'california', 
    'las vegas': 'nevada',
    'austin': 'texas',
    'houston': 'texas'
}

var apiObj = {};

// api call function
var getCurrentWeather = function(){

    // api call based on user paramerter
    var cityName = document.getElementById('city-search').value;
    cityName = cityName.trim().toLowerCase();

    var state = cityObj[cityName];
    var baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${state}&appid=${apiKey}&units=imperial`

    // current day weather
    fetch(baseUrl).then(function(response){
        response.json().then(function(data) {
            // update html containers to show data
            console.log(data);
            tempEl.innerHTML = tempEl.innerHTML + data.main.temp;
            windEl.innerHTML = windEl.innerHTML + data.wind.speed + ' MPH';
            humidityEl.innerHTML = humidityEl.innerHTML + data.main.humidity + ' %';
        });
    });
}

// insert response values into appropriate html containers
var populateResults = function(apiResponse){
    humidityEl = apiResponse.main
    console.log(humidityEl);
}


// event listeners
searchButtonEl.addEventListener('click', getCurrentWeather);

