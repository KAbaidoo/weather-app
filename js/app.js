/* 
requirements
Provide current weather conditions and forecast based on a city search
1.  Detect location of user and provide weather conditions on start of application.
2.  Enable user to bookmark a city to be loaded on next visit
3.  
*/

const API_KEY = "c1749cb94a9a268e7a35ba3804755af0";
const current = document.querySelector(".current");
const input = document.getElementById("search")
const bookmark = document.querySelector(".fa-star")

function loadPage() {
    // check for bookmarked city
    let city = localStorage.getItem('bookmark')
    if (!(city === null || city === "")) {
        // load weather for bookmarked city
        fetchWeather(city)
            .then(displayWeather)

    } else {
        // if there are no bookmarked cities load weather by location coordinates
        getLocationCoords()
    }
}

window.addEventListener("DOMContentLoaded",
    loadPage)

// reload button
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
        fetchWeather(latitude, longitude).then(displayWeather);

    }
    function onError() {
        alert(`Failed to get your location!`);
    }
}

// get weather of search city
input.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        let city = input.value;
        fetchWeather(city).then(displayWeather)
    }
})

//fetch weather
async function fetchWeather() {

    let params;
    if (arguments.length === 1 && typeof arguments[0] === "string") {
        params = "q=" + arguments[0];
    } else if (arguments.length === 2 && typeof arguments[0] === "number") {
        params = "lat=" + arguments[0] + "&lon=" + arguments[1];
    }
    let res = [];
    let type = ["weather", "forecast"]
    for (let i = 0; i < 2; i++) {
        try {
            let response = await fetch(`http://api.openweathermap.org/data/2.5/${type[i]}?${params}&appid=${API_KEY}&units=metric`);
            if (response.status === 200) {
                res[i] = await response.json();
            }
        } catch (error) {
            console.log(error);
        }
    }
    let cResponse = res[0], fResponse = res[1];
    return { cResponse, fResponse }

}


// display information
let displayWeather = (param) => {
    let currentData = param.cResponse,
        forecastData = param.fResponse;

    // display  current weather
    displayCurrent(currentData)

    // display 4-day forecast
    displayForecast(forecastData)

    // change bookmark icon if city is bookmarked
    if (localStorage.getItem('bookmark')) {
        let fav = localStorage.getItem('bookmark');

        if (fav === currentData.name.toLowerCase()) {
            bookmark.classList.remove("far")
            bookmark.classList.add("fas")
        }//End bookmarking 
    }
}

// Display the current weather conditions
async function displayCurrent(currentData) {
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

    let currentWeather = `<article class="current">
         <h1>${city}, ${country}</h1>
         <img src=\"${images.icon_day}\" alt=\"${images.main}-icon\" class=\"weather-icon\">
         <h2><span>${temp}&nbsp;°C</span> <br>${results}</h2>
         <p>Feels like ${feelsLike}&nbsp;°   &nbsp;&nbsp;    Wind ${windSpeed}&nbsp;km/h   &nbsp;&nbsp;    Visibility ${visibility / 1000}&nbsp;km<br>
         Pressure ${pressure}&nbsp;hPa   &nbsp;&nbsp;    Humidity ${humidity}&nbsp;%</p>
 
       </article>`;
    current.innerHTML = currentWeather;
}



// Display the forecast for 4 days
async function displayForecast(forecastData) {
    let forecast = [];
    let data;
    let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    let now = new Date();

    let day = now.getDay() + 1;
    let dayOfWeek = "Tomorrow";
    let dayDate = "";
    let j = 1;
    for (i = 8; i < 40; i = i + 8) {
        data = forecastData.list[i]


        let temp = data.main.temp.toPrecision(2);
        let feels_like = data.main.feels_like.toPrecision(2);
        let desc = data.weather[0].description;
        let id = data.weather[0].id;

        let images = await getImages(id);

        forecast.push(`<article class="day forecast">
            <h2 class="date">${dayOfWeek}&nbsp;${dayDate}</h2>
            <img src=\"${images.icon_day}\" alt=\"${images.main}-icon\" class=\"weather-icon\">
    
            <p class="temp"><span>${temp}&nbsp;°</span> ${feels_like}&nbsp;°</p>
            <p class="description">${desc}</p>
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
    let dailyContainer = document.querySelector(".daily-forecast .container");
    dailyContainer.innerHTML = forecastJoin;
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


//Then, develop the renderUsers() function that renders user data:

/* async function renderImages() {

    let images = await getImages();
    let id = 500;
    let res = null;
    images.forEach(e => {
        if (e._id.includes(id)) {
            res = e;
        }
    })
    console.log(res)


    // let arr = []
    // arr.



    /*  let html = "";
     users.forEach((user) => {
         let htmlSegment = `<div class="user">
                               <div class="img-container">
                                 <img src="person-1.jpeg" class="person-img" alt="" />
                               </div>
                               <h4 class="name">${user.firstName} ${user.lastName}</h4>
                               <div class="email">
                                 <a href="email:${user.email}">${user.email}</a>
                               </div>
                             </div>`;

         html += htmlSegment;
     });

     let contentWrap = document.querySelector(".content-wrap");
     contentWrap.innerHTML = html;
} */

