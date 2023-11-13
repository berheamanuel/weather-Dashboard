
// clear local storage
localStorage.clear();

function findCity() {
    var cityName = $("#cityName").val();    
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API_KEYS;

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            response.json()
            .then(function (data) {                

                $("#city-name")[0].textContent = cityName + " (" + dayjs().format('MM DD YYYY') + ")";

                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' + cityName);

                var latitude = data.coord.lat;
                var longitude = data.coord.lon;

                var latLonPair = latitude.toString() + " " + longitude.toString();

                localStorage.setItem(cityName, latLonPair);

                apiURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly&units=imperial&appid=" + API_KEYS;

                fetch(apiURL)
                .then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json()
                        .then(function (newData) {                           
                            getCurrentWeather(newData);
                        })
                    }
                })
            })
        } else {
            alert("Cannot find city!");
        }
    })
}

// function gets the info for a city already in the list
function getListCity(coordinates) {    
    apiURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&exclude=minutely,hourly&units=imperial&appid=" + API_KEYS;

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            response.json()
            .then(function (data) {            
                
                getCurrentWeather(data);
            })
        }
    })
}

// function to get current weather
function getCurrentWeather(data) {    
    $(".results-panel").addClass("visible");
    $("#currentIcon")[0].src = "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png";
    $("#temperature")[0].textContent = "Temperature: " + data.list[0].main.temp + " \u2109";
    $("#humidity")[0].textContent = "Humidity: " + data.list[0].main.humidity + "%";
    $("#wind-speed")[0].textContent = "Wind Speed: " + data.list[0].wind.speed + " MPH";
    
    getFiveDaysWeather(data);
}

// function to get five days weather forecast
function getFiveDaysWeather(data) {  
   
    for (var i = 0; i < 5; i++) {
        var futureWeather = {
            date: dayjs(dayjs()).add(i+1, 'day').format('MM/DD/YYYY'),
            dayIcon: "http://openweathermap.org/img/wn/" + data.list[i+1].weather[0].icon + "@2x.png",
            temprature: data.list[i+1].main.temp,
            humidity: data.list[i+1].main.humidity
        }

        var currentSelector = "#day-" + i;
        $(currentSelector)[0].textContent = futureWeather.date;
        currentSelector = "#img-" + i;
        $(currentSelector)[0].src = futureWeather.dayIcon;
        currentSelector = "#temp-" + i;
        $(currentSelector)[0].textContent = "Temp: " + futureWeather.temprature + " \u2109";
        currentSelector = "#hum-" + i;
        $(currentSelector)[0].textContent = "Humidity: " + futureWeather.humidity + "%";
    }
}

// This function applies title case to a city name if there is more than one word.
function titleCase(city) {    
    var updatedCity = city.toLowerCase().split(" ");
    var returnedCity = "";
    for (var i = 0; i < updatedCity.length; i++) {
        updatedCity[i] = updatedCity[i].toUpperCase() + updatedCity[i].slice(1);
        returnedCity += " " + updatedCity[i];
    }
    return returnedCity;
}

// event listener to search for city name
$("#search-button").on("click", function (e) {    
    e.preventDefault();
    findCity();
    $("form")[0].reset();
});

// event listener to triger listed city info
$(".city-list-box").on("click", ".city-name", function () {
    var coordinates = (localStorage.getItem($(this)[0].textContent)).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);

    $("#city-name")[0].textContent = $(this)[0].textContent + " (" + dayjs().format('MM DD YYYY') + ")";

    getListCity(coordinates);
});