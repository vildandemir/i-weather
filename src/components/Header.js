import React from "react";
import { useWeather } from "./WeatherContext";
import logo from "../assets/Logo.png";

const Header = () => {
  const { weatherData, getWeatherAnimation, loadingLocation, error } =
    useWeather();

  return (
    <header className="flex flex-col lg:flex-row justify-between lg:items-start items-center h-auto lg:h-20">
      <img src={logo} alt="logo" className="mb-4 lg:mb-0" />{" "}
      {weatherData && (
        <div className="currentLocation lg:text-right animate-slideLeft">
          <h3>
            {weatherData.name}, {weatherData.sys.country}
          </h3>
          <p className="bigAnimation">
            {parseInt(weatherData.main.temp)} °C <br />
            <br />
            {getWeatherAnimation(weatherData.weather[0].description)}
          </p>
        </div>
      )}
      {loadingLocation && (
        <div className="animate-pulse space-x-4">
          <div className="rounded-full bg-slate-700 h-10 w-10"></div>
        </div>
      )}
      {error && <p>{error}</p>}
    </header>
  );
};

export default Header;
