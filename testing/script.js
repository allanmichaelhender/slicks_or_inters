const API_KEY = "fea40e9d7e8986ddf6345b9f625b9658";

// 1. Initialize the Map
const map = L.map("map").setView([51.505, -0.09], 10);

// 2. Add Base Map (Voyager No Labels)
const osmBase = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors © <a href="https://carto.com">CARTO</a>',
    subdomains: "abcd",
  }
).addTo(map);

// 3. Define Weather Layers
const clouds = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`, { zIndex: 10 });
const rain = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`, { zIndex: 10 });
const tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`, { zIndex: 10 });
const windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`, { zIndex: 10 });

// 4. Add Layer Control
const baseMaps = { "OpenStreetMap": osmBase };
const overlayMaps = {
  "Clouds": clouds,
  "Precipitation": rain,
  "Temperature": tempLayer,
  "Wind Speed": windLayer,
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

// Set default layer
tempLayer.addTo(map);

// 5. Add Labels on top of weather layers
L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png", {
  subdomains: "abcd",
  zIndex: 1000,
}).addTo(map);

// 6. London Marker Logic
const londonLat = 51.5074;
const londonLon = -0.1278;

function getWindDirection8(degrees) {
  const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8;
  return directions[index];
}

async function setLondonMarker() {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather/?lat=${londonLat}&lon=${londonLon}&units=metric&appid=${API_KEY}`);
    const data = await response.json();

    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const windSpeed = data.wind.speed;
    const windDeg = data.wind.deg;

    const marker = L.marker([londonLat, londonLon]).addTo(map);
    marker.bindPopup(`
        <div style="text-align:center; min-width: 100px;">
            <h4 style="margin:0;">London</h4>
            <div style="font-size: 1.5em; font-weight: bold;">${temp}°C</div>
            <div style="text-transform: capitalize;">${desc}</div>
            <div>Wind: ${windSpeed}m/s ${getWindDirection8(windDeg)}</div>
        </div>
    `).openPopup();
  } catch (error) {
    console.error("Error setting London marker:", error);
  }
}

setLondonMarker();
