function getCurrentWeather(data, zipCode) {
    console.log(data)
    // Check to see if the OpenWeather API returned an error
    if (data.cod == '404' || data.cod == '401' || zipCode.trim() == '') {
        // show the initially hidden div
        weatherContent.style.display = 'block'
        weatherContent.innerHTML = 'Please enter a valid Zip Code'
        return // exit
    }

    // declare variables
    // create a p element
    let box = document.createElement('p')
    // p element for extra info
    let longBox = document.createElement('p')
    let date = new Date(data.dt * 1000)
    // get the sunrise and sunset
    let sunrise = new Date(data.sys.sunrise * 1000)
    let sunset = new Date(data.sys.sunset * 1000)
    let dateStr = date.toLocaleDateString('en-us')
    let timeStr = date.toLocaleTimeString('en-us')
    let sunriseStr = sunrise.toLocaleTimeString('en-us')
    let sunsetStr = sunset.toLocaleTimeString('en-us')

    // assemble main box
    box.innerHTML = `<h3>${timeStr}</h3><h2>${data.name}</h2><h1>${data.main.temp}°F</h1><p>${data.main.temp_min}°F/${data.main.temp_max}°F</p><p class="weather">${data.weather[0].description}`
    // add the p to the weatherContent to the DOM using the data from the API
    weatherContent.append(box)
    // create img element for icon
    const icon = document.createElement('img')
    // set the src attribute
    icon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
    // set the alt attribute
    icon.setAttribute('alt', 'Weather Icon')
    // add the icon to the DOM
    weatherContent.append(icon)
    // make the box visible
    weatherContent.style.display = 'block'

    // assemble extra box
    longBox.innerHTML = `<h3>${dateStr}</h3><p>Feels Like: ${data.main.feels_like}°F</p><p>Wind Speed: ${data.wind.speed} mph</p><p>Humidity: ${data.main.humidity}%</p><p>Sunrise: ${sunriseStr}</p><p>Sunset: ${sunsetStr}</p>`
    // append extra box
    moreWeatherContent.append(longBox)
    // make the extra box visible
    moreWeatherContent.style.display = 'block'
}

function getWeatherForecast(data, zipCode) {
    console.log(data)
    // Check to see if the OpenWeather API returned an error
    if (data.cod == '404' || data.cod == '401' || zipCode.trim() == '') {
        // show the initially hidden div
        weatherContent.style.display = 'block'
        weatherContent.innerHTML = 'Please enter a valid Zip Code'
        return // exit
    }

    // declare variables
    let currentDate
    let increment = -1 // increment to keep track of forecast boxes
    let littleDiv
    let icon

    for (let i = 0; i < 6; i++) {
        weekWeatherContent[i].style.display = 'flex' // make forecast divs visible
    }

    data.list.forEach(function (dayTime) {
        // create date div
        let div = document.createElement('div')
        let date = new Date(dayTime.dt * 1000)
        let dayStr = date.toLocaleDateString('en-us')
        let timeStr = date.toLocaleTimeString('en-us')

        // create weather boxes
        littleDiv = document.createElement('div')
        // create icons
        icon = document.createElement('img')

        if (currentDate != dayStr) {
            increment = increment + 1 // increase increment to move to next box
            currentDate = dayStr
            // assemble date div
            div.innerHTML = `<h3>${dayStr} - ${data.city.name}</h3>`
            div.className = 'date'
            // append date div
            weekWeatherContent[increment].append(div)
            // assemble weather boxes
            littleDiv.innerHTML = `<h3>${timeStr}</h3><h1>${dayTime.main.temp}°F</h1><p>${dayTime.main.temp_min}°F/${dayTime.main.temp_max}°F</p><p class="left">Feels Like: ${dayTime.main.feels_like}°F<br>Wind Speed: ${dayTime.wind.speed} mph<br>Humidity: ${dayTime.main.humidity}%</p><p class="weather">${dayTime.weather[0].description}</p>`
            littleDiv.className = 'weatherBox'
            // append weather boxes
            weekWeatherContent[increment].append(littleDiv)
            // set icon src attribute
            icon.setAttribute('src', `http://openweathermap.org/img/wn/${dayTime.weather[0].icon}.png`)
            // set the alt attribute
            icon.setAttribute('alt', 'Weather Icon')
            // append icon
            littleDiv.append(icon)
        } else {
            // assemble weather boxes
            littleDiv.innerHTML = `<h3>${timeStr}</h3><h1>${dayTime.main.temp}°F</h1><p>${dayTime.main.temp_min}°F/${dayTime.main.temp_max}°F</p><p class="left">Feels Like: ${dayTime.main.feels_like}°F<br>Wind Speed: ${dayTime.wind.speed} mph<br>Humidity: ${dayTime.main.humidity}%</p><p class="weather">${dayTime.weather[0].description}</p>`
            littleDiv.className = 'weatherBox'
            // append weather boxes
            weekWeatherContent[increment].append(littleDiv)
            // set icon src attribute
            icon.setAttribute('src', `http://openweathermap.org/img/wn/${dayTime.weather[0].icon}.png`)
            // set the alt attribute
            icon.setAttribute('alt', 'Weather Icon')
            // append icon
            littleDiv.append(icon)
        }
    })
}

// Declare Variables
const weatherContent = document.querySelector('#nowWeather')
const moreWeatherContent = document.querySelector('#moreWeather')
const weekWeatherContent = document.querySelectorAll('.forecast')
const API_KEY = 'YOUR_API_KEY_HERE'

document.querySelector('#getWeather').addEventListener('click', function () {
    // clear out all prior results
    weatherContent.innerHTML = ''
    moreWeatherContent.innerHTML = ''
    weatherContent.style.display = 'none'
    moreWeatherContent.style.display = 'none'
    for (let i = 0; i < 6; i++) {
        weekWeatherContent[i].innerHTML = ''
        weekWeatherContent[i].style.display = 'none'
    }

    let zipCode = document.querySelector('#zip').value
    let url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},US&appid=${API_KEY}&units=imperial`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Call getWeather function
            getCurrentWeather(data, zipCode)
        }).catch((e) => {
            console.log(`This error occurred: ${e}`)
        })
})

document.querySelector('#getWeatherForecast').addEventListener('click', function () {
    // clear out all prior results
    weatherContent.innerHTML = ''
    moreWeatherContent.innerHTML = ''
    weatherContent.style.display = 'none'
    moreWeatherContent.style.display = 'none'
    for (let i = 0; i < 6; i++) {
        weekWeatherContent[i].innerHTML = ''
        weekWeatherContent[i].style.display = 'none'
    }

    let zipCode = document.querySelector('#zip').value
    let url = `http://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},US&appid=${API_KEY}&units=imperial`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Call getWeather function
            getWeatherForecast(data, zipCode)
        }).catch((e) => {
            console.log(`This error occurred: ${e}`)
        })
})