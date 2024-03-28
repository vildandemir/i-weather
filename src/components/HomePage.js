import React, { useEffect, useState } from "react";
import { useWeather } from "./WeatherContext";
import axios from "axios";
import CityWeather from "./CityWeather";
import logo from "../assets/Logo.png";

const HomePage = () => {
  const {
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
  } = useWeather();

  const { getWeatherAnimation } = useWeather();

  const [showSavedCities, setShowSavedCities] = useState(true);

  useEffect(() => {
    const savedCitiesFromLocalStorage =
      JSON.parse(localStorage.getItem("savedLocations")) || [];
    setSavedCities(savedCitiesFromLocalStorage);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherDataByCoordinates(latitude, longitude);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleLocationClick = async (location) => {
    setSelectedLocation(location);
  };

  const handleBackButtonClick = () => {
    setSelectedLocation(null);
    setSearchQuery("");
    setSearchResults([]);
    setSavedCities(JSON.parse(localStorage.getItem("savedLocations")) || []);
  };

  const handleInputChange = async (e) => {
    setSearchQuery(e.target.value);
    setShowSavedCities(e.target.value === ""); // Input boş ise, kaydedilmiş şehirleri göster
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
          <img src={logo} alt="logo" />

          {loadingLocation && <p>Location Loading...</p>}
          {weatherData && (
            <div className="currentLocation">
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
          <h1>
            Welcome to <span>TypeWeather</span>
          </h1>
          <p>Choose a location to see the weather forecast</p>
          <input
            type="text"
            placeholder="Search location"
            value={searchQuery}
            onChange={handleInputChange}
          />
          {error && <p>{error}</p>}
          {!isCityNameValid(searchQuery) &&
            searchQuery.length > 0 &&
            !searchResults.length && <p>Please enter a valid city name.</p>}
          {(showSavedCities || searchQuery === "") && ( // Show saved cities if showSavedCities is true or input is empty
            <ul className="savedCitiesList">
              {savedCities.map((city) => {
                const [cityName, countryCode, temperature, description] =
                  city.split(",");
                return (
                  <li className="savedCity" key={city}>
                    <span
                      onClick={() => handleLocationClick(city)}
                      style={{ cursor: "pointer" }}
                    >
                      {cityName}, {countryCode}
                      <br />
                      <span className="desc">{description}</span>
                    </span>{" "}
                    <span className="temperature">
                      {parseInt(temperature)}°C{" "}
                      {getWeatherAnimation(description)}
                    </span>
                    <button onClick={() => removeCity(city)}>
                      {" "}
                      <i className="fas fa-times fa-lg"></i>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <ul className="searchResultList">
            {searchResults.map((result) => (
              <li
                className="searchResult"
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
    </div>
  );
};

export default HomePage;
