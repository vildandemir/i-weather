import React from "react";
import { WeatherProvider } from "./components/WeatherContext";
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <WeatherProvider>
      <HomePage title="Weather App" subtitle="Check the weather in your city" />
    </WeatherProvider>
  );
};

export default App;
