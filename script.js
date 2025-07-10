
const messages = [
  "Welcome to our page!",
  "Search a city to get instant weather info!",
  "See forecasts, air quality, UV index & more.",
  "Powered by OpenWeatherMap API!"
];

let welcomeIndex = 0;
const welcomeEl = document.getElementById("welcomeMessage");
function rotateWelcomeMessages() {
  if (!welcomeEl) return;

  // Fade out
  welcomeEl.style.opacity = 0;

  setTimeout(() => {
    welcomeEl.textContent = messages[welcomeIndex];
    welcomeEl.style.opacity = 1;
    welcomeIndex = (welcomeIndex + 1) % messages.length;

    // Schedule next change
    setTimeout(rotateWelcomeMessages, 3000);
  }, 800); // Wait for fade-out before changing text
}



 
  document.querySelector('.logo-btn').addEventListener('click', function () {
    location.reload(); // Refresh the page
  });



rotateWelcomeMessages();


let map;
let marker;
window.addEventListener("DOMContentLoaded", () => {
  // 🌍 Default view: centered on Africa
  map = L.map('map').setView([8.9806, 38.7578], 2);

  // 🗺️ OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});

// header section mobile display code 
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('navList');
const navLinks = navList.querySelectorAll('li');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');

  if (navList.classList.contains('show')) {
    // Start closing animations
    navList.classList.add('closing');

    navLinks.forEach((link, i) => {
      link.style.animation = `dropOut 0.4s ease forwards`;
      link.style.animationDelay = `${i * 0.1}s`;
    });

    const totalDuration = 0.4 + (navLinks.length - 1) * 0.1;

    setTimeout(() => {
      navList.style.maxHeight = '0';
    }, 100);

    setTimeout(() => {
      navList.classList.remove('show', 'closing');
      navList.style.maxHeight = '';
      hamburger.classList.remove('active'); // Reset hamburger
      navLinks.forEach(link => {
        link.style.animation = '';
        link.style.animationDelay = '';
      });
    }, (totalDuration + 0.3) * 1000);

  } else {
    navList.classList.remove('closing');
    navList.classList.remove('show');
    navList.style.maxHeight = '';
    void navList.offsetWidth;
    navList.classList.add('show');

    navLinks.forEach((link, i) => {
      link.style.animation = 'none';
      link.offsetHeight;
      link.style.animation = `dropIn 0.4s ease forwards`;
      link.style.animationDelay = `${i * 0.1}s`;
    });
  }
});

document.addEventListener('click', (e) => {
  const isClickInsideMenu = navList.contains(e.target);
  const isClickOnHamburger = hamburger.contains(e.target);

  if (!isClickInsideMenu && !isClickOnHamburger && navList.classList.contains('show')) {
    hamburger.click(); // Triggers the full close sequence
  }
});


navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navList.classList.contains('show')) {
      hamburger.click(); // triggers the close animation and X icon reset
    }
  });
});




// this is to fetch the data


const apiKey = "274569506cae8ffe8330ef27ce94b22e"; // replace with your real key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");





searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    
    document.getElementById("welcomeMessage").style.display = "none";


    clearWeatherData();
    document.getElementById("weatherData").classList.add("hidden");
    fetchWeather(city);
  }
});


async function fetchWeather(city) {
  const base = "https://api.openweathermap.org/data/2.5";
  const url = `${base}/weather?q=${city}&appid=${apiKey}&units=metric`;
  document.getElementById("navList").classList.remove("hidden");
   document.getElementById("hamburger").classList.remove("hidden");
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    // 🧠 Update DOM with real data
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)} °C`;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("feelsLike").textContent = `Feels Like: ${Math.round(data.main.feels_like)} °C`;
    document.getElementById("wind").textContent = `Wind: ${data.wind.speed} km/h`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("pressure").textContent = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById("visibility").textContent = `Visibility: ${data.visibility / 1000} km`;

    
const { lat, lon } = data.coord;



fetchForecast(lat, lon);
fetchAirQuality(lat, lon);
fetchUVIndex(lat, lon);
updateMap(lat, lon, data.name);


document.getElementById("weatherData").classList.remove("hidden");
// Animate sections smoothly
setTimeout(() => {
  document.querySelectorAll('.section').forEach((sec, i) => {
    setTimeout(() => {
      sec.classList.add('show');
    }, i * 200); // Stagger delay
  });
}, 300);

    // Weather icon
    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Local time
    const localTime = new Date((data.dt + data.timezone) * 1000);
    document.getElementById("localTime").textContent = `Local Time: ${localTime.toUTCString().slice(17, 22)} ${city}`;

    // Sunrise & sunset
    const sunrise = new Date((data.sys.sunrise + data.timezone) * 1000);
    const sunset = new Date((data.sys.sunset + data.timezone) * 1000);
    document.getElementById("sunrise").textContent = `Sunrise: ${sunrise.toUTCString().slice(17, 22)}`;
    document.getElementById("sunset").textContent = `Sunset: ${sunset.toUTCString().slice(17, 22)}`;
    
  } 
   catch (error) {
    alert("⚠️ " + error.message);
    document.getElementById("weatherData").classList.add("hidden");

  }
  showWeatherTrivia();
}




function displayHourlyForecast(hourly) {
  const hourlyContainer = document.getElementById("hourlyForecast");
  hourlyContainer.innerHTML = ""; // clear previous

  // Show next 12 hours
  hourly.slice(0, 12).forEach(hour => {
    const date = new Date(hour.dt * 1000);
    const hourStr = date.getHours() + ":00";

    const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;

    const card = document.createElement("div");
    card.innerHTML = `
      <p>${hourStr}</p>
      <img src="${iconUrl}" alt="${hour.weather[0].description}" width="40" />
      <p>${Math.round(hour.temp)} °C</p>
    `;
    hourlyContainer.appendChild(card);
  });
}

function displayDailyForecast(daily) {
  
  const dailyContainer = document.getElementById("dailyForecast");
  dailyContainer.innerHTML = ""; // clear previous

  // Show next 5 days
  daily.slice(0, 5).forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString(undefined, { weekday: "long" });

    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    const card = document.createElement("div");
    card.innerHTML = `
      <h4>${dayName}</h4>
      <img src="${iconUrl}" alt="${day.weather[0].description}" width="50" />
      <p>High: ${Math.round(day.temp.max)} °C</p>
      <p>Low: ${Math.round(day.temp.min)} °C</p>
    `;
    dailyContainer.appendChild(card);
  });
}

async function fetchForecast(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(forecastUrl);
    if (!res.ok) throw new Error("Forecast not found");

    const forecastData = await res.json();
    console.log("Forecast data received:", forecastData);

    // Extract hourly: every 3-hour step (first 12 entries = 36 hours)
    const hourly = forecastData.list.slice(0, 12);
    displayHourlyForecast(hourly.map(hour => ({
      dt: hour.dt,
      temp: hour.main.temp,
      weather: hour.weather
    })));

    // Daily: one per day from the list (every 8th item = next day)
    const daily = [];
    for (let i = 7; i < forecastData.list.length; i += 8) {
      daily.push({
        dt: forecastData.list[i].dt,
        temp: {
          max: forecastData.list[i].main.temp_max,
          min: forecastData.list[i].main.temp_min
        },
        weather: forecastData.list[i].weather
      });
    }
    displayDailyForecast(daily);

  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}



async function fetchAirQuality(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Air quality data not found");

    const data = await res.json();
    const air = data.list[0];

    // AQI levels: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
    const aqiDescriptions = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
    const aqi = air.main.aqi;

    document.getElementById("aqi").textContent = `AQI: ${aqi} (${aqiDescriptions[aqi]})`;
    document.getElementById("pm25").textContent = `PM2.5: ${air.components.pm2_5} µg/m³`;
    document.getElementById("pm10").textContent = `PM10: ${air.components.pm10} µg/m³`;
    document.getElementById("co").textContent = `CO: ${air.components.co} mg/m³`;
    document.getElementById("no2").textContent = `NO₂: ${air.components.no2} µg/m³`;
    document.getElementById("o3").textContent = `O₃: ${air.components.o3} µg/m³`;

    // Simple health message
    let healthMessage = "";
    if (aqi === 1) healthMessage = "Air quality is good.";
    else if (aqi === 2) healthMessage = "Fair — no concern for most.";
    else if (aqi === 3) healthMessage = "Moderate — sensitive people should be careful.";
    else if (aqi === 4) healthMessage = "Poor — reduce prolonged outdoor activity.";
    else healthMessage = "Very Poor — avoid outdoor activities.";

    document.getElementById("airHealth").textContent = `Health Impact: ${healthMessage}`;
  } catch (error) {
    console.error("Air Quality Error:", error);
  }
}


async function fetchUVIndex(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("UV Index data not found");

    const data = await res.json();
    const uvi = data.value;

    document.getElementById("uvValue").textContent = `UV Index: ${uvi}`;

    let riskLevel = "";
    let advice = "";

    if (uvi <= 2) {
      riskLevel = "Low";
      advice = "Minimal risk. Wear sunglasses on bright days.";
    } else if (uvi <= 5) {
      riskLevel = "Moderate";
      advice = "Stay in shade during midday hours. Use SPF 30+ sunscreen.";
    } else if (uvi <= 7) {
      riskLevel = "High";
      advice = "Wear protective clothing and sunscreen. Avoid the sun midday.";
    } else if (uvi <= 10) {
      riskLevel = "Very High";
      advice = "Extra protection needed. Minimize sun exposure.";
    } else {
      riskLevel = "Extreme";
      advice = "Avoid sun exposure. Use full protection.";
    }

    document.getElementById("uvRiskLevel").textContent = `Risk Level: ${riskLevel}`;
    document.getElementById("uvAdvice").textContent = `Advice: ${advice}`;
  } catch (error) {
    console.error("UV Index Error:", error);
  }
}


function showWeatherTrivia() {
  const facts = [
    "Lightning strikes Earth 100 times every second!",
    "Tornado winds can reach 484 km/h.",
    "Antarctica hit -89.2°C — the coldest ever recorded.",
    "Mawsynram, India gets 11,871 mm of rain a year!",
    "The Sun is 149.6 million km away.",
    " Mountain winds can exceed 300 km/h!",
    " Rainbows are full circles — not just arcs!",
    " 80% of Earth's atmosphere is in the first 16 km."
  ];

  const factElement = document.getElementById("weatherFact");
  if (factElement) {
    factElement.classList.remove("show");
    factElement.textContent = facts[Math.floor(Math.random() * facts.length)];
    setTimeout(() => factElement.classList.add("show"), 100); // trigger fade-in
  }
}


 


function clearWeatherData() {
  document.getElementById("cityName").textContent = "";
  document.getElementById("temperature").textContent = "";
  document.getElementById("description").textContent = "";
  document.getElementById("feelsLike").textContent = "";
  document.getElementById("wind").textContent = "";
  document.getElementById("humidity").textContent = "";
  document.getElementById("pressure").textContent = "";
  document.getElementById("visibility").textContent = "";
  document.getElementById("weatherIcon").src = "";
  document.getElementById("localTime").textContent = "";
  document.getElementById("sunrise").textContent = "";
  document.getElementById("sunset").textContent = "";

  document.getElementById("hourlyForecast").innerHTML = "";
  document.getElementById("dailyForecast").innerHTML = "";

  document.getElementById("aqi").textContent = "";
  document.getElementById("pm25").textContent = "";
  document.getElementById("pm10").textContent = "";
  document.getElementById("co").textContent = "";
  document.getElementById("no2").textContent = "";
  document.getElementById("o3").textContent = "";
  document.getElementById("airHealth").textContent = "";

  document.getElementById("uvValue").textContent = "";
  document.getElementById("uvRiskLevel").textContent = "";
  document.getElementById("uvAdvice").textContent = "";

 document.getElementById("weatherFact").textContent = "";
}




const newsApiKey = "745377296d014e39a7090554c6e68fd0"; 


async function fetchWeatherNews() {
  const url = `https://newsapi.org/v2/everything?q=weather%20OR%20climate%20OR%20storm&sortBy=publishedAt&language=en&pageSize=5&apiKey=${newsApiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch news");

    const data = await res.json();
    const newsContainer = document.getElementById("newsContainer");
    newsContainer.innerHTML = "";

    data.articles.forEach(article => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="News Image">
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.description || ''}</p>
          <a href="${article.url}" target="_blank">Read more →</a>
        </div>
      `;
      newsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("News Error:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchWeatherNews();
});


function updateMap(lat, lon, cityName) {
  if (!map) return;

  map.setView([lat, lon], 10);

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lon]).addTo(map)
    .bindPopup(cityName)
    .openPopup();
}
