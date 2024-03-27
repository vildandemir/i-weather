import React, { useState, useEffect } from "react";
import axios from "axios";

const CityWeather = ({ cityName, countryCode, onBackButtonClick }) => {
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

  if (error) {
    return <p>{error}</p>;
  }

  if (!currentWeather || !forecastWeather) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div>
        <button onClick={onBackButtonClick}>Back</button>
        <button>Add</button>
      </div>
      <h2>
        Weather in {currentWeather.name}, {currentWeather.sys.country}
      </h2>
      <div>
        <h3>Current Weather</h3>
        <p>Temperature: {currentWeather.main.temp} °C</p>
        <p>Description: {currentWeather.weather[0].description}</p>
      </div>
      <div>
        <h3>5-Day Forecast</h3>
        {forecastWeather.list.slice(0, 5).map((forecast, index) => (
          <div key={index}>
            <p>Date: {forecast.dt_txt}</p>
            <p>Temperature: {forecast.main.temp} °C</p>
            <p>Description: {forecast.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityWeather;
