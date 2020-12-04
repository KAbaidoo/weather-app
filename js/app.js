/* 
requirements
Provide current weather conditions and forecast based on a city search
1.  Detect location of user and provide weather conditions on start of application.
2.  Enable user to bookmark a city to be loaded on next visit
3.  
*/
"use strict";
const API_KEY = "c1749cb94a9a268e7a35ba3804755af0";
const inputs = document.querySelectorAll(".search");
var cdata;
var cities;
(async function () {
    let res = await fetch('../js/city.list.min.json')
    res = await res.json()
    cities = res
})()







//fetch weather

async function fetchWeather(city) {
    let cResponse, fResponse;

    try {

        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (response.status === 200) {
            cResponse = await response.json();
        }
    } catch (error) {
        console.log(error);
    }
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        if (response.status === 200) {
            fResponse = await response.json();
        }
    } catch (error) {
        console.log(error);
    }
    cdata = cResponse;
    return { cResponse, fResponse }

}

// display information
function displayWeather(param) {
    const { cResponse, fResponse } = param

    // display  current weather
    displayCurrent(cResponse)

    // display 4-day forecast
    displayForecast(fResponse)

    // change bookmark icon if city is bookmarked

    let fav = localStorage.getItem('bookmark')
    console.log('bookmark', fav)
    console.log("search", cdata.name)

    // bookmark.classList.add("fas")
    bookmark.classList.remove("fas")

    if (fav === cdata.name) {
        // bookmark.classList.remove("far")
        bookmark.classList.add("fas")
    }
    //End bookmarking

}

// Display the current weather conditions
async function displayCurrent(currentData) {
    const current = document.querySelector(".current");
    current.innerHTML = `<div class="loader">Loading...</div>`

    let temp = currentData.main.temp.toPrecision(2);
    let feelsLike = currentData.main.feels_like.toPrecision(2);
    let humidity = currentData.main.humidity;
    let pressure = currentData.main.pressure;
    let windSpeed = currentData.wind.speed;
    let visibility = currentData.visibility;
    let country = currentData.sys.country;
    let city = currentData.name;
    let arr = currentData.weather;
    let desc = [];
    arr.forEach(obj => {
        desc.push(obj["description"]);
    })
    let results = desc.join(", ");
    let id = currentData.weather[0].id;
    let images = await getImages(id);

    let currentWeather = `<h1>${city}, ${country}</h1>
                        <img src=\"${images.icon_day}\" alt=\"${images.main}-icon\" class=\"weather-icon\">
                        <h2><span>${temp}&nbsp;°C</span> <br>${results}</h2>
                        <p>Feels like&nbsp;&nbsp;${feelsLike}&nbsp;°   &nbsp;&nbsp;    Wind ${windSpeed}&nbsp;km/h   &nbsp;&nbsp;    Visibility&nbsp;${visibility / 1000}&nbsp;km<br>
                        Pressure&nbsp;${pressure}&nbsp;hPa   &nbsp;&nbsp;    Humidity&nbsp;${humidity}&nbsp;%</p>`;

    setTimeout(() => {
        current.innerHTML = currentWeather;
    }, 1000)

}

// Display the forecast for 4 days
async function displayForecast(forecastData) {
    const dailyContainer = document.querySelector(".daily-forecast .container");

    dailyContainer.innerHTML = `<div class="loader">Loading...</div>`
    let forecast = [];
    let data;
    let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    let now = new Date();

    let day = now.getDay() + 1;
    let dayOfWeek = "Tomorrow";
    let dayDate = "";
    let j = 1;
    for (let i = 8; i < 40; i = i + 8) {
        data = forecastData.list[i]
        let temp = data.main.temp.toPrecision(2);
        let feels_like = data.main.feels_like.toPrecision(2);
        let desc = data.weather[0].description;
        let id = data.weather[0].id;

        let images = await getImages(id);

        forecast.push(`<article class="day forecast">
            <h2 class="date">${dayOfWeek}&nbsp;${dayDate}</h2>
            <div class="content-wrap">
            <img src=\"${images.icon_day}\" alt=\"${images.main}-icon\" class=\"weather-icon\">
    
            <p class="temp"><span>${temp}&nbsp;°</span> ${feels_like}&nbsp;°</p>
            <p class="description">${desc}</p>
            </div>
            
        </article>`);

        //Determine the date and days of forecast
        day++
        j++
        if (day > 6) {
            day = 0;
        }
        let mSecs = now.getTime() + (j * 24 * 3600 * 1000)
        let date = new Date(mSecs)
        dayDate = date.getDate();
        dayOfWeek = week[day];


    }
    let forecastJoin = forecast.join("\n");

    setTimeout(() => {
        dailyContainer.innerHTML = forecastJoin;
    }, 1200)

}

async function getImages(id) {
    let res = null;
    try {
        let response = await fetch("../js/images.json");
        let images = await response.json();
        images.forEach(e => {
            if (e._id.includes(id)) {
                res = e;
            }
        })
    } catch (e) {
        console.log(e);
    }
    return res;
}

window.addEventListener("DOMContentLoaded", function () {

    let fav = localStorage.getItem('bookmark')
    if (!(fav === null || fav === "")) {

        fetchWeather(fav)
            .then(displayWeather)
    } else {

        getWeatherCityByIp(fetchWeather, displayWeather)
    }
})



async function getWeatherCityByIp(fn1, fn2) {
    let userCity = "";
    try {
        let response = await fetch('https://ipinfo.io/?token=094dece3208b52');
        if (response.status === 200) {

            userCity = await response.json()
            await fn1(userCity.city)
                .then(fn2)
        }
    } catch (error) {
        console.log(error);
    }
    let response = await fetch('../js/city.list.min.json')
    cities = await response.json()

    // return userCity;
}




// get weather of search city
inputs.forEach(input => {
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            let city = input.value;
            fetchWeather(city).then(displayWeather)
        }

    })
})








// Bookmark a city (app loads to bookmarked city on load)



const bookmark = document.querySelector(".fa-star")

bookmark.addEventListener("click", (e) => {
    if (localStorage.getItem('bookmark') === cdata.name) {
        window.localStorage.removeItem('bookmark');
        e.currentTarget.classList.remove("fas")
        e.currentTarget.classList.add("far")
        e.preventDefault()

    } else {
        window.localStorage.setItem('bookmark', cdata.name);
        e.currentTarget.classList.remove("far")
        e.currentTarget.classList.add("fas")
        e.preventDefault()
    }
})



const find = document.querySelector(".find");
const searchBar = document.querySelector(".search-bar")

find.addEventListener("click", (e) => {
    searchBar.classList.toggle("show-search-bar");

})

document.querySelector(".close").addEventListener("click", e => searchBar.classList.toggle("show-search-bar"))

inputs.forEach((input) => {
    input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            searchBar.classList.toggle("show-search-bar");
        }
    })
})



inputs.forEach(input => {
    input.addEventListener("input", e => {
        getCities(e.target.value, cities)

    })
})


function getCities(input, cities) {

    let results = cities.filter((city) => {
        let regex = new RegExp(`^${input}`, "gi")
        return city.name.match(regex)
    })
    if (input.length === 0) {
        results = [];
    }

    displayResults(results)
}



const cityList = document.querySelector(".cities").firstElementChild

function displayResults(results) {
    let html = results.map((result) => {
        return `<li class="city">${result.name}, ${result.country}</li>`
    }).join('')
    cityList.innerHTML = html

    const city = document.querySelectorAll(".city")
    city.forEach(item => item.addEventListener("click", e => {
        let text = e.target.textContent
        let str = text.substring(0, text.indexOf(','))
        inputs.forEach(input => {
            input.value = str
            cityList.innerHTML = '';
            fetchWeather(str).then(displayWeather)
            input.value = ''

        })
        searchBar.classList.toggle("show-search-bar")


    }))


}

// const city = document.querySelectorAll(".city")












