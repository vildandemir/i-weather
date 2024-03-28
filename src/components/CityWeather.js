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
  Label,
} from "recharts";

const CityWeather = ({ cityName, countryCode, onBackButtonClick }) => {
  const { getWeatherAnimation } = useWeather();

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const currentWeatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
        );
        setCurrentWeather(currentWeatherResponse.data);

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
    <div>
      <div>
        <button onClick={onBackButtonClick}>Back</button>
        <button onClick={handleAddButtonClick}>Add</button>
      </div>
      <h2>
        Weather in {currentWeather.name}, {currentWeather.sys.country}
      </h2>
      <div>
        <h3>Current Weather</h3>
        <p> {parseInt(currentWeather.main.temp)} °C</p>
        {getWeatherAnimation(currentWeather.weather[0].description)}
      </div>
      <div>
        <h3>5-Day Forecast</h3>
        {averageDailyForecasts.map((temperature, index) => {
          const date = Object.keys(dailyForecasts)[index];
          const dayName = new Date(date).getDay();
          return (
            <div key={index}>
              <p>{dayNames[dayName]}</p>
              <p> {parseInt(temperature)} °C</p>
              {getWeatherAnimation(
                forecastWeather.list[index].weather[0].description
              )}
            </div>
          );
        })}
      </div>
      <div>
        <h3>Temperature Forecast Graph</h3>
        <LineChart
          width={800}
          height={400}
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
      </div>
    </div>
  );
};

export default CityWeather;
