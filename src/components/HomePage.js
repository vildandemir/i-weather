import React, { useEffect } from "react";
import { useWeather } from "./WeatherContext";
import axios from "axios";
import CityWeather from "./CityWeather";

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
          <h1>iWeather</h1>
          {loadingLocation && <p>Location Loading...</p>}
          {weatherData && (
            <div>
              <h3>
                {weatherData.name}, {weatherData.sys.country}
              </h3>
              <p>
                Temperature: {weatherData.main.temp} °C,{" "}
                {weatherData.weather[0].description}
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
      {error && <p>{error}</p>}
      {!isCityNameValid(searchQuery) &&
        searchQuery.length > 0 &&
        !searchResults.length && <p>Please enter a valid city name.</p>}
    </div>
  );
};

export default HomePage;
