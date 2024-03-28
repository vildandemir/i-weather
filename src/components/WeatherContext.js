import React, { createContext, useContext, useState } from "react";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [savedCities, setSavedCities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const fetchWeatherDataByCoordinates = async (latitude, longitude) => {
    setLoadingLocation(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const fetchWeatherData = async (cityName) => {
    // Implement the weather data fetching logic here
  };

  const isCityNameValid = (name) => {
    const words = name.split(" ");
    return words.every((word) => /^[A-ZİŞĞÜÇÖ][a-zışğüçö]+$/.test(word));
  };

  const removeCity = (city) => {
    const updatedCities = savedCities.filter((c) => c !== city);
    setSavedCities(updatedCities);
    localStorage.setItem("savedLocations", JSON.stringify(updatedCities));
  };

  return (
    <WeatherContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        weatherData,
        setWeatherData,
        error,
        setError,
        selectedLocation,
        setSelectedLocation,
        savedCities,
        setSavedCities,
        loadingLocation,
        setLoadingLocation,
        fetchWeatherData,
        isCityNameValid,
        removeCity,
        fetchWeatherDataByCoordinates,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
