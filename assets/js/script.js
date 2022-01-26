// variables to fetch //

var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = '87db051a26ebe593cc006f7771e981d9';

var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayContainer = document.querySelector('#today');
var forecastContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

// to find search history //
function renderSearchHistory() {
    searchHistory.innerHTML = '';

for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');

    // to data search 

    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
    }
}

function appendToHistory(search) {
// return statement
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);

    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
}

function initSearchHistory() {
    // local storage //
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}

// timezones //
// for the plugin //
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// weather //
// to show what the weather is //

function renderCurrentWeather(city, weather, timezone) {
    var date = dayjs().tz(timezone).format('M/D/YYYY');
    }

    var temp = weather.temp;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;
    var uvi = weather.uvi;
    var iconUrl = 'https://openweathermap.org/img/w/${weather.weather[0].icon}.png';
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h3');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvEl = document.createElement('p');
    var uviBadge = document.createElement('button');

    // append //
    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);

    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    heading.textContent = '${city} (${date})';
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    // append //
    heading.append(weatherIcon);
    tempEl.textContent = 'Temp: ${temp} F';
    windEl.textContent = 'Wind: ${wind} wind';
    humidityEl.textContent = 'Humidity; ${humidity} %';
    // append //
    cardBody.append(heading);
    cardBody.append(tempEl);
    cardBody.append(windEl);
    cardBody.append(humidityEl);

    // to display button colors //

    uvEl.textContent = 'UV Index: ';
    uviBadge.classList.add('btn', 'btn-sm');

    if (uvi < 3) {
        uviBadge.classList.add('btn-success');
    } else if (uvi < 7) {
        uviBadge.classList.add('btn-warning');
    } else {
        uviBadge.classList.add('btn-danger');
    }

    // to append //
    uviBadge.textContent = uvi;
    uvEl.append(uviBadge);
    cardBody.append(uvEl);

    todayContainer.innerHTML = '';
    todayContainer.append(card);


// to display the weather //
function renderForecast(dailyForecast, timezone) {
    var startDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
    var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

    var headingCol = document.createElement('div');
    var heading = document.createElement('h3');

    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:';
    headingCol.append(heading);

    forecastContainer.innerHTMl = '';
    forecastContainer.append(headingCol);
    for (var i = 0; i < dailyForecast.length; i++) {

        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
            renderForecastCard(dailyForecast[i], timezone);
        }
    }
}

function renderItems(city, data) {
    renderCurrentWeather(city, data.current, data.timezone);
    renderForecast(data.daily, data.timezone);
}

// fetch weather, calls to display weather //
function fetchWeather(location){
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var apiURL = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`;

    // fetch, class //
    fetch(apiURL)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        renderItems(city, data);
    })
    .catch(function (err) {
        console.log(err);
    });
}

function handleSearchFormSubmit(e) {
    if (!searchInput.value) {
        return;
    }


    e.preventDefault();
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = '';
}

function handleSearchHistoryClick(e) {
    if (!e.target.matches('.btn-history')) {
        return;
    }

    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchCoords(search);
}

initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);