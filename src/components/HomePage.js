import React, { useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Function to search weather data based on the provided location
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      setWeatherData(null);
      setError(
        "An error occurred while fetching weather data. Please enter a valid city name."
      );
    }
  };

  // Function to handle click on a location from search results
  const handleLocationClick = async (location) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
      );
      console.log(response.data);
    } catch (error) {
      console.error("An error occurred while fetching weather data:", error);
    }
  };

  // Function to handle input change in the search bar
  const handleInputChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${e.target.value}&appid=0c19f5142c89d2eefcbf8545c9dd03d0&units=metric`
        );
        setSearchResults(response.data.list);
        setError(null); // Clear error message on new input
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

  // Function to check if the city name is valid
  const isCityNameValid = (name) => {
    const words = name.split(" ");
    return words.every((word) => /^[A-ZİŞĞÜÇÖ][a-zışğüçö]+$/.test(word));
  };

  return (
    <div className="HomePage">
      <div className="icon"></div>
      <h1>iWeather</h1>
      <h2>Welcome to TypeWeather</h2>
      <p>Choose a location to see the weather forecast</p>
      <input
        type="text"
        placeholder="Search location..."
        value={searchQuery}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((result) => (
          <li key={result.id} onClick={() => handleLocationClick(result.name)}>
            {result.name} - {result.sys.country}
          </li>
        ))}
      </ul>
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
      {/* Display error message if city name is invalid */}
      {!isCityNameValid(searchQuery) &&
        searchQuery.length > 0 &&
        !searchResults.length && <p>Please enter a valid city name.</p>}
    </div>
  );
};

export default HomePage;
