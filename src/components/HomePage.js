import React from "react";

const HomePage = () => {
  return (
    <div className="HomePage">
      <div className="icon"></div>
      <h1>iWeather</h1>
      <h2>Welcome to TypeWeather</h2>
      <p>Choose a location to see the weather forecast</p>
      <input type="text" placeholder="Search location..." />
    </div>
  );
};

export default HomePage;
