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
const btn = document.getElementById("btn");
const input = document.getElementById("search")
const bookmark = document.querySelector(".fa-star")

window.addEventListener("DOMContentLoaded", () => {
    getLocationCoords()
})

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

// get current weather of search city
input.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        let city = input.value;
        getCurrentWeatherByCity(city).then(displayCurrentWeather)
    }
})


// Get current weather
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

}
/* function displayCurrentWeatherByCity(city) {
    getCurrentWeatherByCity(city).then(
        (data) => {
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

        }
    )
}
 */

// Get current weather for bookmarked city upon loading
/* window.addEventListener("DOMContentLoaded", function () {
    // console.log(latitude)
    let city = localStorage.getItem('bookmark')

    if (!(city === null || city === "")) {
        displayCurrentWeather(city)
        bookmark.classList.toggle("far")
        bookmark.classList.toggle("fas")
    }
}) */

// bookmark a city
/* bookmark.addEventListener("click", (e) => {

    if (localStorage.getItem('bookmark') === input.value) {
        window.localStorage.removeItem('bookmark');

        e.currentTarget.classList.toggle("fas")
        e.currentTarget.classList.toggle("far")
    } else {
        window.localStorage.setItem('bookmark', input.value);
        e.currentTarget.classList.toggle("far")
        e.currentTarget.classList.toggle("fas")
    }
}) */

// get location
/* (() => {
    // check if the Geolocation API is supported
    if (!navigator.geolocation) {
        alert(`Your browser doesn't support Geolocation`);
        return;
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // handle success case
    function onSuccess(position) {
        lat = position.coords.longitude;
        lon = position.coords.longitude;
        console.log(`Your location: (${lat},${lon})`);
    }
    // handle error case
    function onError() {
        alert(`Failed to get your location!`);
    }
})();
*/