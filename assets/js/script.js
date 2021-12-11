var searchButtonEl = document.getElementById('search-btn');

var apiKey = '504f46843e11dd1aa60312828047eb5b';
var cityObj = {
    'phoneix': 'arizona',
    'los angeles': 'california', 
    'las vegas': 'nevada',
    'austin': 'texas',
    'houston': 'texas'
}

var getCurrentWeather = function(){

    // api call based on user paramerter
    var cityName = document.getElementById('city-search').value;
    cityName = cityName.trim().toLowerCase();

    var state = cityObj[cityName];
    var baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${state}&appid=${apiKey}`

    var dataResponse =
        fetch(baseUrl).then(function(response){
            response.json().then(function(data) {
                console.log(data);
            });
        });

    return dataResponse;
}

// event listeners
searchButtonEl.addEventListener('click', getCurrentWeather);

