import React from "react";
import { WeatherProvider } from "./components/WeatherContext";
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <WeatherProvider>
      <HomePage />
    </WeatherProvider>
  );
};

export default App;
