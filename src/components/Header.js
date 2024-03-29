// Header.jsx

import React from "react";
import { useWeather } from "./WeatherContext";
import logo from "../assets/Logo.png";

const Header = () => {
  const { weatherData, getWeatherAnimation, loadingLocation, error } =
    useWeather();

  return (
    <header className="flex flex-col lg:flex-row justify-between lg:items-start items-center">
      <img src={logo} alt="logo" className="mb-4 lg:mb-0" />{" "}
      {/* mb-4 sadece mobilde alt alta olmalarını sağlar */}
      {weatherData && (
        <div className="currentLocation lg:text-right">
          {/* lg:text-right sadece tablet ve büyük ekranlarda metni sağa yaslar */}
          <h3>
            {weatherData.name}, {weatherData.sys.country}
          </h3>
          <p>
            {parseInt(weatherData.main.temp)} °C <br />
            {weatherData.weather[0].description}
            <br />
            {getWeatherAnimation(weatherData.weather[0].description)}
          </p>
        </div>
      )}
      {loadingLocation && <p>Location Loading...</p>}
      {error && <p>{error}</p>}
    </header>
  );
};

export default Header;
