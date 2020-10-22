/* 
requirements
Provide current weather conditions and forecast based on a city search
1.  Detect location of user and provide weather conditions on start of application.
2.  Enable user to bookmark a city to be loaded on next visit
3.  



*/

// 


const API_KEY = "c1749cb94a9a268e7a35ba3804755af0";
const current = document.querySelector(".current");
const input = document.getElementById("search")
const bookmark = document.querySelector(".fa-star")

function loadPage() {
    // check for bookmarked city
    let city = localStorage.getItem('bookmark')
    if (!(city === null || city === "")) {
        // load weather for bookmarked city
        getCurrentWeatherByCity(city)
            .then(displayCurrentWeather)
        // bookmark.classList.remove("far")
        // bookmark.classList.add("fas")
    } else {
        // if there are no bookmarked cities load weather by location coordinates
        getLocationCoords()
        // bookmark.classList.remove("fas")
        // bookmark.classList.add("far")
    }

}


window.addEventListener("DOMContentLoaded",
    loadPage)



const reloadBtn = document.querySelector(".fa-redo")
//  Reload weather information
reloadBtn.addEventListener("click",
    loadPage
)



// Bookmark a city (app loads to bookmarked city on load)

bookmark.addEventListener("click", (e) => {

    if (localStorage.getItem('bookmark') === input.value) {
        window.localStorage.removeItem('bookmark');
        e.currentTarget.classList.remove("fas")
        e.currentTarget.classList.add("far")

    } else {
        window.localStorage.setItem('bookmark', input.value);
        e.currentTarget.classList.remove("far")
        e.currentTarget.classList.add("fas")
    }
})


// get weather based on location coordinates of user browser
function getLocationCoords() {
    // check if the Geolocation API is supported

    if (!navigator.geolocation) {
        alert(`Your browser doesn't support Geolocation`);
        return;
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
    // handle success case
    function onSuccess(position) {
        const { latitude, longitude } = position.coords
        getCurrentWeatherByCoords(latitude, longitude).then(displayCurrentWeather);

    }
    function onError() {
        alert(`Failed to get your location!`);
    }
}

// get weather of search city
input.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        let city = input.value;
        getCurrentWeatherByCity(city).then(displayCurrentWeather)
    }
})


// Get weather data
async function getCurrentWeatherByCoords(lat, lon) {
    try {
        let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (response.status === 200) { return await response.json(); }
    } catch (error) {
        console.log(error);
    }
}
async function getCurrentWeatherByCity(city) {
    try {
        let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (response.status === 200) { return await response.json(); }
    } catch (error) {
        console.log(error);
    }
}


// display information
let displayCurrentWeather = (data) => {
    let temp = data.main.temp.toPrecision(2);
    let feelsLike = data.main.feels_like.toPrecision(2);
    let humidity = data.main.humidity;
    let pressure = data.main.pressure;
    let windSpeed = data.wind.speed;
    // let windDeg = data.wind.deg;
    let visibility = data.visibility;
    let country = data.sys.country;
    let city = data.name;
    let arr = data.weather;
    let desc = [];
    arr.forEach(obj => {
        desc.push(obj["main"]);
    })
    let results = desc.join(", ");
    let currentWeather = `<article class="current">
        <h1>${city}, ${country}</h1>
        <h2><span>${temp}&nbsp;°C</span> <br>${results}</h2>
        <p>Feels like ${feelsLike}&nbsp;°   &nbsp;&nbsp;    Wind ${windSpeed}&nbsp;km/h   &nbsp;&nbsp;    visibility ${visibility / 1000}&nbsp;km<br>
        Pressure ${pressure}&nbsp;hPa   &nbsp;&nbsp;    Humidity ${humidity}&nbsp;%</p>

      </article>`;
    current.innerHTML = currentWeather;

    // change bookmark icon if city is bookmarked
    if (localStorage.getItem('bookmark')) {
        let fav = localStorage.getItem('bookmark');
        if (fav === city.toLowerCase()) {
            bookmark.classList.remove("far")
            bookmark.classList.add("fas")
        }
    }
}