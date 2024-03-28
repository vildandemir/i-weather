import React from "react";
import { WeatherProvider } from "./components/WeatherContext";
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <WeatherProvider>
      <div className="App">
        <HomePage />
      </div>
    </WeatherProvider>
  );
};

export default App;
