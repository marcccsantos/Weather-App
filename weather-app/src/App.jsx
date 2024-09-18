import { useState, useEffect } from "react";
import axios from "axios";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiHumidity,
  WiBarometer,
  WiStrongWind,
} from "react-icons/wi";
import { FaTemperatureHigh } from "react-icons/fa";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Utility function to convert a string to title case
  const toTitleCase = (str) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8fa2ab90ef32aaa598d08f531df0bf4a`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get the user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error(error);
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Function to fetch weather data using coordinates
  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=8fa2ab90ef32aaa598d08f531df0bf4a`
      );
      setWeatherData(response.data);
      setCity(response.data.name);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Could not fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [city]);

  useEffect(() => {
    // Fetch weather by current location when the component mounts
    getCurrentLocation();
  }, []);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="border border-red-500 h-lvh flex justify-center items-center">
      <div className="border border-red-500 w-full h-full">
        <form
          onSubmit={handleSubmit}
          className="border border-red-500 flex justify-center"
        >
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={handleInputChange}
          />
          <button type="submit" className="border border-black">
            Get Weather
          </button>
        </form>
        {loading ? (
          <p>Loading weather data...</p>
        ) : weatherData ? (
          <div className="flex flex-row h-full">
            {/* <h2>{weatherData.name}</h2> */}
            <div className="flex flex-col items-center w-1/2 border border-red-500">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="h-96 w-96"
              />
              <p className="font-poppins">
                {toTitleCase(weatherData.weather[0].description)}
              </p>
            </div>
            <div className="flex flex-col gap-4 font-poppins w-1/2 m-5">
              <div className="flex-1 "></div>
              <div className="flex-1 border border-red-500 p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start justify-between border border-red-500 p-4 gap-4">
                    <div className="flex flex-col">
                      <h1 className="text-lg">Temperature</h1>
                      <h1 className="text-2xl">{weatherData.main.temp}°C</h1>
                    </div>
                    <FaTemperatureHigh className="mt-1" />
                  </div>
                  <div className="flex items-start justify-between p-4 border border-red-500">
                    <div className="flex flex-col">
                      <h1 className="text-lg">Humidity</h1>
                      <h1 className="text-2xl">{weatherData.main.humidity}%</h1>
                    </div>
                    <WiHumidity className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start justify-between border border-red-500 p-4">
                    <div className="flex flex-col">
                      <h1 className="text-lg">Pressure</h1>
                      <h1 className="text-2xl">
                        {weatherData.main.pressure} hPa
                      </h1>
                    </div>
                    <WiBarometer />
                  </div>
                  <div className="flex items-start justify-between border border-red-500 p-4">
                    <div className="flex flex-col">
                      <h1 className="text-lg">Wind Speed</h1>
                      <h1 className="text-2xl">{weatherData.wind.speed} m/s</h1>
                    </div>
                    <WiStrongWind />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          error && <p>{error}</p>
        )}
      </div>
    </div>
  );
}

export default App;
