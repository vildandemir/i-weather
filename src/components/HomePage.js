import React, { useEffect, useState } from "react";
import { useWeather } from "./WeatherContext";
import axios from "axios";
import CityWeather from "./CityWeather";
import logo from "../assets/Logo.png";
import Header from "./Header";

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
    <div className="text-center">
      {selectedLocation ? (
        <CityWeather
          cityName={selectedLocation.split(",")[0]}
          countryCode={selectedLocation.split(",")[1]}
          onBackButtonClick={handleBackButtonClick}
        />
      ) : (
        <React.Fragment>
          <Header />
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
          {(showSavedCities || searchQuery === "") && (
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
    // </div>
  );
};

export default HomePage;
