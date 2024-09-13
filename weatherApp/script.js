function getWeather(defaultCity) {
    const apiKey = 'key';
    if (defaultCity == null) {
        var city = document.getElementById('city').value;
    } else {
        var city = defaultCity
    }

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetchWeatherData(currentWeatherUrl, displayWeather);
    fetchWeatherData(forecastUrl, data => displayHourlyForecast(data.list.slice(0, 8)));
}

function fetchWeatherData(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(callback)
        .catch(() => alert('Error fetching weather data. Please try again.'));
}

function capitalize(object) {
    const words = object.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
}

function getDayOfWeek(num) {
    const daysOfWeek = new Map([
        [0, 'Sunday'],
        [1, 'Monday'],
        [2, 'Tuesday'],
        [3, 'Wednesday'],
        [4, 'Thursday'],
        [5, 'Friday'],
        [6, 'Saturday']
    ]);

    return daysOfWeek.get(num) || 'Invalid number';
}

function getMonthOfYear(num) {
    const monthsOfYear = new Map([
        [0, 'January'],
        [1, 'February'],
        [2, 'March'],
        [3, 'April'],
        [4, 'May'],
        [5, 'June'],
        [6, 'July'],
        [7, 'August'],
        [8, 'September'],
        [9, 'October'],
        [10, 'November'],
        [11, 'December']
    ]);

    return monthsOfYear.get(num) || 'Invalid number';
}

function displayWeather(data) {
    const tempDiv = document.getElementById('tempDiv');
    const weatherInfoDiv = document.getElementById('weatherInfo');
    const weatherIcon = document.getElementById('weatherIcon');

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    const city = data.name;
    const temp = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    tempDiv.innerHTML = `<div id="caption">Now</div></span><p>${temp}<span>°C</span></p>`;
    const d = new Date();
    weatherInfoDiv.innerHTML = `<p><span>${capitalize(description)}</span></p><div id="line"></div><p><span><i class="fa-regular fa-calendar"></i></span> ${getDayOfWeek(d.getDay())} ${d.getDate()}, 
    ${getMonthOfYear(d.getMonth())}</p><p><span><i class="fa-solid fa-location-dot"></i></span> ${city}, ${data.sys.country}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.style.display = 'block';
    displayHighlights(data)
}

function displayHighlights(data) {
    const humidityDiv = document.getElementById('humidity');
    const feelsLikeDiv = document.getElementById('feelsLike');
    const pressureDiv = document.getElementById('pressure');
    const windDiv = document.getElementById('wind');
    const sunDiv = document.getElementById('sun');
    const tempMinDiv = document.getElementById('tempMin');
    const tempMaxDiv = document.getElementById('tempMax');

    const humidity = data.main.humidity;
    const feelsLike = Math.round(data.main.feels_like - 273.15);
    const pressure = data.main.pressure;
    const wind = Math.round(data.wind.speed * 3600 / 1000);
    const sunriseH = new Date(data.sys.sunrise * 1000).getHours()
    const sunriseM = new Date(data.sys.sunrise * 1000).getMinutes()
    const sunsetH = new Date(data.sys.sunset * 1000).getHours()
    const sunsetM = new Date(data.sys.sunset * 1000).getMinutes()
    const tempMin = Math.round(data.main.temp_min - 273.15);
    const tempMax = Math.round(data.main.temp_max - 273.15);

    humidityDiv.innerHTML = `<i class="fa-solid fa-droplet"></i><p>${humidity}<span>%</span></p>`;
    feelsLikeDiv.innerHTML = `<i class="fa-solid fa-seedling"></i><p>${feelsLike}<span>°C</span></p>`;
    pressureDiv.innerHTML = `<i class="fa-solid fa-align-right"></i><p>${pressure}<span> hPa</span></p>`;
    windDiv.innerHTML = `<i class="fa-solid fa-wind"></i><p>${wind}<span> km/hr</span></p>`;
    sunDiv.innerHTML = `<i class="fa-solid fa-sun"></i><p>${sunriseH}:${sunriseM} ${sunsetH}:${sunsetM}</p>`;
    tempMinDiv.innerHTML = `<i class="fa-solid fa-snowflake"></i><div id="tempTitle"><b>Min temperature</b><p>${tempMin}<span>°C</span></p></div>`;
    tempMaxDiv.innerHTML = `<i class="fa-solid fa-sun"></i><div id="tempTitle"><b>Max temperature</b><p>${tempMax}<span>°C</span></p></div>`;
}

function displayHourlyForecast(data) {
    const hourlyDiv = document.getElementById('hourlyForecast');
    hourlyDiv.innerHTML = '';

    data.forEach(item => {
        const hour = new Date(item.dt * 1000).getHours();
        const temp = Math.round(item.main.temp - 273.15);
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        const hDescription = item.weather[0].description;

        hourlyDiv.innerHTML += `
            <div id="hourlyItem">
                <div id="time"><span>${hour}:00</span></div>
                <div id="separator"></div>
                ${temp}<span>°C</span>
                <img src="${iconUrl}" alt="Weather Icon">
                <div id="hDescription">${capitalize(hDescription)}</div>
            </div>`;
    });
}
