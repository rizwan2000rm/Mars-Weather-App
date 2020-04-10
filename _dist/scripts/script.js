const API_URL =
  "https://api.nasa.gov/insight_weather/?api_key=WsBTHU2KiPLFELCwWZofHC8CX12VnaH4JaAdZhl5&feedtype=json&ver=1.0";

const solDisplay = document.querySelector("#sol");
const dateDisplay = document.querySelector(".date");
const highTempDisplay = document.querySelector("#high-temp");
const lowTempDisplay = document.querySelector("#low-temp");
const windSpeedDisplay = document.querySelector("#wind-speed");
const windDiretionDisplay = document.querySelector(".wind-arrow");

let recentSolIndex;

function displayDate(date) {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long" });
}

getWeather().then((sols) => {
  recentSolIndex = sols.length - 1;
  console.log(sols[recentSolIndex]);
  displayRecentSol(sols);
});

function displayRecentSol(sols) {
  const recentSol = sols[recentSolIndex];
  solDisplay.textContent = recentSol.sol;
  dateDisplay.textContent = displayDate(recentSol.date);
  highTempDisplay.textContent = recentSol.maxTemp;
  lowTempDisplay.textContent = recentSol.minTemp;
  windSpeedDisplay.textContent = recentSol.windSpeed;
  windDiretionDisplay.style.setProperty(
    "--direction",
    `${recentSol.windDirectionDegrees}deg`
  );
}

function getWeather() {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const { sol_keys, validity_checks, ...solData } = data;
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS.av,
          windDirectionDegrees: data.WD.most_common.compass_degrees,
          windDirectionCardinal: data.WD.most_common.compass_point,
          date: new Date(data.First_UTC),
        };
      });
    });
}
