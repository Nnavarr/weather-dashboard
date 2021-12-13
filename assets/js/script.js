// establish global variables
var searchButtonEl = document.getElementById('search-btn');
var searchContainerEl = document.getElementById('search-container');
var tempEl = document.getElementById('temp');
var windEl = document.getElementById('wind');
var humidityEl = document.getElementById('humidity');
var uvEl = document.getElementById('uvi-main');
var cityTitleEl = document.getElementById('city');
var mainImgEl = document.getElementById('main-img');
var forecastTitleEl = document.getElementById('forecast-title');

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
    'houston': 'texas',
    'new york': 'new york',
    'philadelphia': 'pennsylvania',
    'san antonio': 'texas',
    'san diego': 'california',
    'san fransisco': 'california',
    'dallas': 'texas',
    'san jose': 'california',
    'miami': 'florida'
}

// api call: current weather
var getWeather = function(){
    // api call based on user input
    var cityName = document.getElementById('city-search').value;
    cityName = cityName.trim().toLowerCase();

    var state = cityObj[cityName];
    var baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${state}&appid=${apiKey}&units=imperial`
    
    // current day weather
    fetch(baseUrl).then(function(response){
        response.json().then(function(data) {
            console.log(data);
            // set lat/long coordinates for forecast API
            lat = data.coord.lat;
            lon = data.coord.lon;

            // update search history 
            var searchObj = {
                    'city': cityName,
                    'lon': lon,
                    'lat': lat
                }

            // check for presence of previous searches. If none, create object.
            if (!searchHistory){
                searchHistory = [];
                searchHistory.push(searchObj);
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            } else {
                searchHistory.push(searchObj);
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            }

            // update html containers to show data
            var date = new Date(data.dt * 1000).toLocaleDateString('en-US');
            cityTitleEl.innerHTML = data.name + ' (Current) - ' + date;
  
            // current & 5 day forecast
            getForecastWeather(lat, lon);
        });
    });
    
}

// api call: 5 day forecast
var getForecastWeather = function(lat, lon){
    // api call based on user input
    var baseUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    // extract forecast data
    fetch(baseUrl).then(function(response){
        response.json().then(function(data) {
            // update HTML elements for current day into
            mainImgEl.src = `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`
            tempEl.innerHTML = 'Temp : ' + data.current.temp;
            windEl.innerHTML = 'Wind: ' + data.current.wind_speed + ' MPH';
            humidityEl.innerHTML = 'Humidity ' + data.current.humidity;

            // uv index logic
            var uvi = data.current.uvi;
            uvEl.innerHTML = 'UVI: ' + data.current.uvi;
            if (uvi <= 2.99){
                uvEl.style.backgroundColor = 'green';
                uvEl.style.color = 'white';
            } else if ((uvi >= 3) && (uvi <=5)){
                uvEl.style.backgroundColor = 'yellow';
            } else {
                uvEl.style.backgroundColor = 'red';
                uvEl.style.color = 'white';
            }

            // update HTML elements for forecast info
            forecastTitleEl.innerHTML = '5 Day Forecast'
            for (var i = 0; i < forecastEl.length; i++){
                // position 0 = next day forecast
                forecastEl[i].children[0].innerHTML = new Date(data.daily[i].dt * 1000).toLocaleDateString('en-US'); // date
                forecastEl[i].children[1].src = `http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`
                forecastEl[i].children[2].innerHTML = 'Day: ' + data.daily[i].temp.day;
                forecastEl[i].children[3].innerHTML = 'Wind: ' + data.daily[i].wind_speed + ' MPH';
                forecastEl[i].children[4].innerHTML = 'Humidity: ' + data.daily[i].humidity + ' %';   

                // uv index logic
                var uvi = parseFloat(data.daily[i].uvi);
                forecastEl[i].children[5].innerHTML = 'UVI: ' + uvi.toString();
                if (uvi <= 2.99){
                    forecastEl[i].children[5].style.backgroundColor = 'green';
                    forecastEl[i].children[5].style.color = 'white';
                } else if ((uvi >= 3) && (uvi <=5)){
                    forecastEl[i].children[5].style.backgroundColor = 'yellow';
                    forecastEl[i].children[5].style.color = 'black';
                } else {
                    forecastEl[i].children[5].style.backgroundColor = 'red';
                    forecastEl[i].children[5].style.color = 'white';
                }

            }
        })
    })
}

// import search history
var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

// create set to capture unique keys from searchHistory object
var uniqueCity = new Set();
if (searchHistory){
    for (var i = 0; i < searchHistory.length; i ++){
        uniqueCity.add(searchHistory[i].city);
    }
}

var uniqueCityArray = Array.from(uniqueCity);
for(i in uniqueCityArray){
    if (uniqueCityArray[i].length > 1){
        var searchButton = document.createElement('button');
        searchButton.className = 'hist-button';
        searchButton.textContent = uniqueCityArray[i];

        // append historical buttons to search container
        searchContainerEl.append(searchButton);
    }
}

// event listeners
searchButtonEl.addEventListener('click', getWeather);

searchContainerEl.addEventListener('click', function(event){
    var clicked = event.target;
    if (clicked.className == 'hist-button'){
        var cityName = document.getElementById('city-search');
        cityName.value = clicked.textContent;
        getWeather();
    }
})