// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useWeather } from "./WeatherContext";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// import day from "../assets/day.jpg";
// import night from "../assets/night.png";

// const CityWeather = ({ cityName, countryCode, onBackButtonClick }) => {
//   const { getWeatherAnimation } = useWeather();

//   const [currentWeather, setCurrentWeather] = useState(null);
//   const [forecastWeather, setForecastWeather] = useState(null);
//   const [error, setError] = useState(null);
//   const [isDay, setIsDay] = useState(true); // Gece veya gündüz kontrolü

//   useEffect(() => {
//     const fetchWeatherData = async () => {
//       try {
//         const currentWeatherResponse = await axios.get(
//           `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
//         );
//         setCurrentWeather(currentWeatherResponse.data);

//         // Gündüz mü gece mi olduğunu kontrol et
//         const currentTime = new Date().getHours();
//         setIsDay(currentTime > 6 && currentTime < 20);

//         console.log("Current Weather Data:", currentWeatherResponse.data);

//         const forecastWeatherResponse = await axios.get(
//           `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${countryCode}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
//         );
//         setForecastWeather(forecastWeatherResponse.data);
//       } catch (error) {
//         setError("An error occurred while fetching weather data.");
//       }
//     };

//     fetchWeatherData();
//   }, [cityName, countryCode]);

//   const handleAddButtonClick = () => {
//     const selectedLocation = `${cityName},${countryCode},${currentWeather.main.temp},${currentWeather.weather[0].description}`;
//     const savedLocations =
//       JSON.parse(localStorage.getItem("savedLocations")) || [];

//     const isAlreadySaved = savedLocations.some(
//       (location) => location.split(",")[0] === cityName
//     );

//     if (isAlreadySaved) {
//       alert("This location is already saved!");
//       return;
//     }

//     savedLocations.push(selectedLocation);
//     localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
//     alert("Location added successfully!");
//   };

//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (!currentWeather || !forecastWeather) {
//     return <p>Loading...</p>;
//   }

//   // Calculate 5-day weather forecast by averaging each day
//   const dailyForecasts = forecastWeather.list.reduce((acc, forecast) => {
//     const date = forecast.dt_txt.split(" ")[0];
//     if (!acc[date]) {
//       acc[date] = [];
//     }
//     acc[date].push(forecast);
//     return acc;
//   }, {});

//   // Calculate average temperature for each day
//   const averageDailyForecasts = Object.values(dailyForecasts).map(
//     (forecasts) => {
//       const avgTemperature =
//         forecasts.reduce((sum, forecast) => sum + forecast.main.temp, 0) /
//         forecasts.length;
//       return parseInt(avgTemperature);
//     }
//   );

//   // Array to map day indexes to day names
//   const dayNames = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   // Prepare data for Recharts LineChart
//   const chartData = Object.keys(dailyForecasts).map((date, index) => ({
//     day: dayNames[new Date(date).getDay()],
//     temperature: averageDailyForecasts[index],
//   }));

//   //Get local time
//   const localTime = new Date(
//     new Date().getTime() +
//       (currentWeather.timezone + new Date().getTimezoneOffset() * 60) * 1000
//   );
//   return (
//     <div className="container mx-auto">
//       <div className="flex justify-between items-center">
//         <button onClick={onBackButtonClick}>Back</button>
//         <button onClick={handleAddButtonClick}>Add</button>
//       </div>
//       <h1 className="mt-4 mb-2">
//         Weather in {currentWeather.name}, {currentWeather.sys.country}
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div
//           style={{
//             position: "relative",
//           }}
//         >
//           {/* <h3>Current Weather</h3> */}
//           <img
//             src={isDay ? day : night}
//             alt="day"
//             style={{
//               maxWidth: "250px",
//               width: "100%",
//               height: "auto",
//               objectFit: "cover",
//               borderRadius: "10px",
//               boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//             }}
//           ></img>
//           <div
//             style={{
//               position: "absolute",
//               top: "10px",
//               color: { isDay } ? "black" : "white",
//             }}
//             className="flex justify-between items-center"
//           >
//             <div>
//               <h3>
//                 {currentWeather.name}, {currentWeather.sys.country}
//               </h3>

//               <p>
//                 {localTime.toLocaleDateString("en-US", {
//                   weekday: "long",
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </p>
//               <p>
//                 {localTime.toLocaleTimeString("en-US", {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   hour12: false,
//                 })}
//               </p>
//             </div>
//             <div className="weather-animation">
//               {getWeatherAnimation(currentWeather.weather[0].description)}
//             </div>
//           </div>
//           <div>
//             <p>{currentWeather.weather[0].description}</p>
//             <p> {parseInt(currentWeather.main.temp)} °C</p>
//           </div>

//           <div>
//             <div>
//               <p>
//                 <i
//                   className="fa-solid fa-temperature-three-quarters"
//                   style={{ color: "#3b3b54" }}
//                 ></i>{" "}
//                 Thermal sensation: {currentWeather.main.feels_like}{" "}
//               </p>
//               <p>
//                 <i
//                   className="fa-solid fa-compress"
//                   style={{ color: "#3b3b54" }}
//                 ></i>
//                 Pressure: {currentWeather.main.pressure}{" "}
//               </p>
//               <p>
//                 <i
//                   className="fa-solid fa-wind"
//                   style={{ color: "#3b3b54" }}
//                 ></i>{" "}
//                 Wind speed: {currentWeather.wind.speed} k/h{" "}
//               </p>
//               <p>
//                 <i
//                   className="fa-solid fa-droplet"
//                   style={{ color: "#3b3b54" }}
//                 ></i>
//                 Air humidity: % {currentWeather.main.humidity}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div>
//           <div>
//             {/* <h3>5-Day Forecast</h3> */}
//             <div className="flex flex-wrap">
//               {averageDailyForecasts.slice(0, 5).map((temperature, index) => {
//                 const date = Object.keys(dailyForecasts)[index];
//                 const dayName = new Date(date).getDay();
//                 return (
//                   <div key={index} className="w-full md:w-1/5">
//                     <p>{dayNames[dayName]}</p>
//                     <p> {parseInt(temperature)} °C</p>
//                     {getWeatherAnimation(
//                       forecastWeather.list[index].weather[0].description
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           <div>
//             <h3>Temperature Forecast Graph</h3>
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart
//                 data={chartData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="day"
//                   label={{ value: "Day", position: "insideBottomRight" }}
//                 />
//                 <YAxis
//                   label={{
//                     value: "Temperature (°C)",
//                     angle: -90,
//                     position: "insideLeft",
//                   }}
//                 />
//                 <Tooltip />
//                 <Legend align="left" verticalAlign="bottom" />
//                 <Line
//                   type="monotone"
//                   dataKey="temperature"
//                   stroke="#8884d8"
//                   activeDot={{ r: 8 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CityWeather;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useWeather } from "./WeatherContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import day from "../assets/day.jpg";
import night from "../assets/night.png";

const CityWeather = ({ cityName, countryCode, onBackButtonClick }) => {
  const { getWeatherAnimation } = useWeather();

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isDay, setIsDay] = useState(true); // Gece veya gündüz kontrolü
  const currentTime = new Date().getHours();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const currentWeatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
        );
        setCurrentWeather(currentWeatherResponse.data);

        // Gündüz mü gece mi olduğunu kontrol et
        const currentTime = new Date().getHours();
        const sunriseTime = new Date(
          currentWeatherResponse.data.sys.sunrise * 1000
        ).getHours();
        const sunsetTime = new Date(
          currentWeatherResponse.data.sys.sunset * 1000
        ).getHours();
        setIsDay(currentTime >= sunriseTime && currentTime < sunsetTime);

        console.log("Current Weather Data:", currentWeatherResponse.data);

        const forecastWeatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${countryCode}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
        );
        setForecastWeather(forecastWeatherResponse.data);
      } catch (error) {
        setError("An error occurred while fetching weather data.");
      }
    };

    fetchWeatherData();
  }, [cityName, countryCode]);

  const handleAddButtonClick = () => {
    const selectedLocation = `${cityName},${countryCode},${currentWeather.main.temp},${currentWeather.weather[0].description}`;
    const savedLocations =
      JSON.parse(localStorage.getItem("savedLocations")) || [];

    const isAlreadySaved = savedLocations.some(
      (location) => location.split(",")[0] === cityName
    );

    if (isAlreadySaved) {
      alert("This location is already saved!");
      return;
    }

    savedLocations.push(selectedLocation);
    localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
    alert("Location added successfully!");
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!currentWeather || !forecastWeather) {
    return <p>Loading...</p>;
  }

  // Calculate 5-day weather forecast by averaging each day
  const dailyForecasts = forecastWeather.list.reduce((acc, forecast) => {
    const date = forecast.dt_txt.split(" ")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(forecast);
    return acc;
  }, {});

  // Calculate average temperature for each day
  const averageDailyForecasts = Object.values(dailyForecasts).map(
    (forecasts) => {
      const avgTemperature =
        forecasts.reduce((sum, forecast) => sum + forecast.main.temp, 0) /
        forecasts.length;
      return parseInt(avgTemperature);
    }
  );

  // Array to map day indexes to day names
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Prepare data for Recharts LineChart
  const chartData = Object.keys(dailyForecasts).map((date, index) => ({
    day: dayNames[new Date(date).getDay()],
    temperature: averageDailyForecasts[index],
  }));

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <button onClick={onBackButtonClick}>Back</button>
        <button onClick={handleAddButtonClick}>Add</button>
      </div>
      <h1 className="mt-4 mb-2">
        Weather in {currentWeather.name}, {currentWeather.sys.country}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          style={{
            position: "relative",
          }}
        >
          {/* <h3>Current Weather</h3> */}
          <img
            src={isDay ? day : night}
            alt="day"
            style={{
              maxWidth: "250px",
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          ></img>
          <div
            style={{
              position: "absolute",
              top: "10px",
              color: isDay ? "black" : "white",
            }}
            className="flex justify-between items-center"
          >
            <div>
              <h3>
                {currentWeather.name}, {currentWeather.sys.country}
              </h3>
              <p>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="weather-animation">
              {getWeatherAnimation(currentWeather.weather[0].description)}
            </div>
          </div>
          <div>
            <p>{currentWeather.weather[0].description}</p>
            <p> {parseInt(currentWeather.main.temp)} °C</p>
          </div>

          <div>
            <div>
              <p>
                <i
                  className="fa-solid fa-temperature-three-quarters"
                  style={{ color: "#3b3b54" }}
                ></i>{" "}
                Thermal sensation: {currentWeather.main.feels_like}{" "}
              </p>
              <p>
                <i
                  className="fa-solid fa-compress"
                  style={{ color: "#3b3b54" }}
                ></i>
                Pressure: {currentWeather.main.pressure}{" "}
              </p>
              <p>
                <i
                  className="fa-solid fa-wind"
                  style={{ color: "#3b3b54" }}
                ></i>{" "}
                Wind speed: {currentWeather.wind.speed} k/h{" "}
              </p>
              <p>
                <i
                  className="fa-solid fa-droplet"
                  style={{ color: "#3b3b54" }}
                ></i>
                Air humidity: % {currentWeather.main.humidity}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div>
            {/* <h3>5-Day Forecast</h3> */}
            <div className="flex flex-wrap">
              {averageDailyForecasts.slice(0, 5).map((temperature, index) => {
                const date = Object.keys(dailyForecasts)[index];
                const dayName = new Date(date).getDay();
                return (
                  <div key={index} className="w-full md:w-1/5">
                    <p>{dayNames[dayName]}</p>
                    <p> {parseInt(temperature)} °C</p>
                    {getWeatherAnimation(
                      forecastWeather.list[index].weather[0].description
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3>Temperature Forecast Graph</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  label={{ value: "Day", position: "insideBottomRight" }}
                />
                <YAxis
                  label={{
                    value: "Temperature (°C)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend align="left" verticalAlign="bottom" />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityWeather;
