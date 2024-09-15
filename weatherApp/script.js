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
    fetchWeatherData(forecastUrl, data => displayDaily(data.list.slice(0)));
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

function prettifyMinutes(object) {
    return object < 10 ? "0" + object : object;
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
    displayHighlights(data);
}

function displayHighlights(data) {
    const humidityDiv = document.getElementById('humidity');
    const feelsLikeDiv = document.getElementById('feelsLike');
    const pressureDiv = document.getElementById('pressure');
    const windDiv = document.getElementById('wind');
    const riseDiv = document.getElementById('rise');
    const setDiv = document.getElementById('set');
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
    riseDiv.innerHTML = `<i class="fa-solid fa-sun"></i><div id="tempTitle"><b>Sunrise</b><p>${sunriseH}:${prettifyMinutes(sunriseM)}</p>`;
    setDiv.innerHTML = `<i class="fa-solid fa-circle"></i><div id="tempTitle"><b>Sunset</b><p>${sunsetH}:${prettifyMinutes(sunsetM)}</p>`;
    tempMinDiv.innerHTML = `<i class="fa-solid fa-snowflake"></i><div id="tempTitle"><b>Min temperature</b><p>${tempMin}<span>°C</span></p></div>`;
    tempMaxDiv.innerHTML = `<i class="fa-solid fa-sun"></i><div id="tempTitle"><b>Max temperature</b><p>${tempMax}<span>°C</span></p></div>`;
}

function findMinValue(collection) {
    return Math.min(...collection)
}

function findMaxValue(collection) {
    return Math.max(...collection);
}

function shortStr(string, letters) {
    return string.length > letters ? string.substring(0, letters) : string;
}

function mostFrequentString(string) {
    const occurrences = {};
    let maxCount = 0;
    let mostFrequent = null;

    string.forEach(str => {
        occurrences[str] = (occurrences[str] || 0) + 1;
        if (occurrences[str] > maxCount) {
            maxCount = occurrences[str];
            mostFrequent = str;
        }
    });

    return mostFrequent;
}

function displayDaily(data) {
    let previousDate = data[0].dt_txt;

    let allTimeHighTemp = -Infinity;
    let allTimeLowTemp = Infinity;

    let dateCollection = [];

    let lowTempCollection = [];
    let highTempCollection = [];
    let avgWeatherCollection = [];

    let tempCollection = [];
    let weatherCollection = [];
    
    data.forEach(item => {
        let date = item.dt_txt.split(" ");
        let temp = Math.round(item.main.temp - 273.15);
        let weather = item.weather[0].main;
        tempCollection.push(temp);
        weatherCollection.push(weather);

        if (temp < allTimeLowTemp) allTimeLowTemp = temp;
        if (temp > allTimeHighTemp) allTimeHighTemp = temp;

        if (date[0] !== previousDate) {
            if (tempCollection.length > 0) {
                lowTempCollection.push(findMinValue(tempCollection));
                highTempCollection.push(findMaxValue(tempCollection));
                dateCollection.push(previousDate);
                avgWeatherCollection.push(mostFrequentString(weatherCollection));
            }
            tempCollection = [];
            previousDate = date[0];
            weatherCollection = [];
        }
    });

    if (tempCollection.length > 0) {
        lowTempCollection.push(findMinValue(tempCollection));
        highTempCollection.push(findMaxValue(tempCollection));
        dateCollection.push(previousDate);
        avgWeatherCollection.push(mostFrequentString(weatherCollection));
    }

    // removes today if there has been 6 days recorded
    while (lowTempCollection.length > 5) {
        lowTempCollection.shift();
        highTempCollection.shift();
        dateCollection.shift();
        avgWeatherCollection.shift();
    }

    console.log(avgWeatherCollection);

    const d = new Date();
    renderDailyTemperatures(document.getElementById('daily1'), highTempCollection[0], lowTempCollection[0], dateCollection[0], avgWeatherCollection[0], allTimeHighTemp, allTimeLowTemp, getDayOfWeek(d.getDay()));
    renderDailyTemperatures(document.getElementById('daily2'), highTempCollection[1], lowTempCollection[1], dateCollection[1], avgWeatherCollection[1], allTimeHighTemp, allTimeLowTemp, getDayOfWeek(d.getDay()+1));
    renderDailyTemperatures(document.getElementById('daily3'), highTempCollection[2], lowTempCollection[2], dateCollection[2], avgWeatherCollection[2], allTimeHighTemp, allTimeLowTemp, getDayOfWeek(d.getDay()+2));
    renderDailyTemperatures(document.getElementById('daily4'), highTempCollection[3], lowTempCollection[3], dateCollection[3], avgWeatherCollection[3], allTimeHighTemp, allTimeLowTemp, getDayOfWeek(d.getDay()+3));
    renderDailyTemperatures(document.getElementById('daily5'), highTempCollection[4], lowTempCollection[4], dateCollection[4], avgWeatherCollection[4], allTimeHighTemp, allTimeLowTemp, getDayOfWeek(d.getDay()+4));
}

function renderDailyTemperatures(div, highTemp, lowTemp, date, weather, allTimeHighTemp, allTimeLowTemp, day) {
    date = date.split("-");
    div.innerHTML = 
        `<div id="dailyHeader">
            <div id="day">${shortStr(day, 3)}</div>
            <div id="date">${date[2]}<span> th</span></div>
            <div id="avgWeather">mostly <span>${weather}</span></div>
            <div id="separatorLine"></div>
        </div>
        <div id="tempDisplay">
            <div id="tempLow">${lowTemp}<span>°</span></div>
            <div id="bar"></div>
            <div id="tempHigh">${highTemp}<span>°</span></div>
        </div>`;

    let tempBar = div.querySelector('#bar');

    const rangePercent = ((highTemp - lowTemp) / (allTimeHighTemp - allTimeLowTemp)) * 100;
    const lowOffsetPercent = ((lowTemp - allTimeLowTemp) / (allTimeHighTemp - allTimeLowTemp)) * 100;

    const tempRange = document.createElement('div');
    tempRange.className = 'temp-range';
    tempRange.style.width = `${rangePercent}%`;
    tempRange.style.left = `${lowOffsetPercent}%`;
    tempRange.style.position = 'absolute';
    tempBar.appendChild(tempRange);
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
