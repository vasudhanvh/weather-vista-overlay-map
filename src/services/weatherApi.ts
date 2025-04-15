
import { WeatherData } from "@/types/weather";

const WEATHER_API_KEY = '79c64f2dd24b462d9b9100603251204'; // WeatherAPI.com key
export const OPEN_WEATHER_MAP_KEY = 'fc14f8194b3cb8d04e8743ad77837f3b'; // OpenWeatherMap key

// Fetch weather data by coordinates
export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=3&hourly=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Fetch weather data by city name
export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=3&hourly=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get user's current location
export const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};
