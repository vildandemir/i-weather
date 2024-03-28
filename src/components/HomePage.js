import React, { useState, useEffect } from "react";
import axios from "axios";
import CityWeather from "./CityWeather";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [savedCities, setSavedCities] = useState([]);
  const [defaultLocation, setDefaultLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const savedCitiesFromLocalStorage =
      JSON.parse(localStorage.getItem("savedLocations")) || [];
    setSavedCities(savedCitiesFromLocalStorage);

    // Geolocation support
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherDataByCoordinates(latitude, longitude);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchWeatherDataByCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
      );
      setDefaultLocation(response.data);
    } catch (error) {
      console.error("An error occurred while fetching weather data:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleLocationClick = async (location) => {
    try {
      setSelectedLocation(location);
    } catch (error) {
      console.error("An error occurred while fetching weather data:", error);
    }
  };

  const handleBackButtonClick = () => {
    setSelectedLocation(null);
    setSearchQuery("");
    setSearchResults([]);
    setSavedCities(JSON.parse(localStorage.getItem("savedLocations")) || []);
  };

  const handleInputChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${e.target.value}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
        );
        setSearchResults(response.data.list);
        setError(null);
      } catch (error) {
        console.error(
          "An error occurred while fetching search results:",
          error
        );
      }
    } else {
      setSearchResults([]);
    }
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
    <div className="HomePage">
      {selectedLocation ? (
        <CityWeather
          cityName={selectedLocation.split(",")[0]}
          countryCode={selectedLocation.split(",")[1]}
          onBackButtonClick={handleBackButtonClick}
        />
      ) : (
        <React.Fragment>
          <div className="icon"></div>
          <h1>iWeather</h1>
          {loadingLocation && "Location Loading..."}

          {defaultLocation && (
            <div>
              <h3>
                {defaultLocation.name}, {defaultLocation.sys.country}
              </h3>
              <p>
                {defaultLocation.main.temp} °C,{" "}
                {defaultLocation.weather[0].description}
              </p>
            </div>
          )}
          <h2>Welcome to TypeWeather</h2>
          <p>Choose a location to see the weather forecast</p>
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={handleInputChange}
          />

          <ul>
            {savedCities.map((city) => {
              const [cityName, countryCode, temperature, description] =
                city.split(",");
              return (
                <li key={city}>
                  <span
                    onClick={() => handleLocationClick(city)}
                    style={{ cursor: "pointer" }}
                  >
                    {cityName}, {countryCode} - {parseInt(temperature)}°C{" "}
                    {description}
                  </span>{" "}
                  <button onClick={() => removeCity(city)}>❌</button>
                </li>
              );
            })}
          </ul>

          <ul style={{ zIndex: searchResults.length > 0 ? -1 : 1 }}>
            {searchResults.map((result) => (
              <li
                key={result.id}
                onClick={() =>
                  handleLocationClick(`${result.name},${result.sys.country}`)
                }
              >
                {result.name} - {result.sys.country}
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
      {weatherData && (
        <div>
          <h3>
            {weatherData.name}, {weatherData.sys.country}
          </h3>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
      {error && <p>{error}</p>}
      {!isCityNameValid(searchQuery) &&
        searchQuery.length > 0 &&
        !searchResults.length && <p>Please enter a valid city name.</p>}
    </div>
  );
};

export default HomePage;
