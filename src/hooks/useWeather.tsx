
import { useState, useEffect } from 'react';
import { WeatherData, MapLayerType } from '@/types/weather';
import { fetchWeatherByCoords, fetchWeatherByCity, getUserLocation } from '@/services/weatherApi';
import { useToast } from '@/components/ui/use-toast';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMapLayer, setCurrentMapLayer] = useState<MapLayerType>('temp_new');
  const { toast } = useToast();

  // Load weather based on user's location
  const loadWeatherByLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;
      
      const data = await fetchWeatherByCoords(latitude, longitude);
      setWeatherData(data);
    } catch (err) {
      console.error('Error getting weather by location:', err);
      setError('Failed to get your location. Please search for a city manually.');
      toast({
        title: "Location Error",
        description: "Couldn't access your location. Please search for a city manually.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load weather for a specific city
  const loadWeatherByCity = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchWeatherByCity(city);
      setWeatherData(data);
      
      toast({
        title: "Location Updated",
        description: `Weather for ${data.location.name} loaded successfully.`
      });
    } catch (err) {
      console.error('Error getting weather by city:', err);
      setError('Failed to get weather for this city. Please try another location.');
      toast({
        title: "Search Error",
        description: "Couldn't find weather data for this location. Please try another city.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Change the current map layer
  const changeMapLayer = (layer: MapLayerType) => {
    setCurrentMapLayer(layer);
  };

  // Load weather data on first render
  useEffect(() => {
    loadWeatherByLocation();
  }, []);

  return {
    weatherData,
    loading,
    error,
    currentMapLayer,
    loadWeatherByCity,
    loadWeatherByLocation,
    changeMapLayer
  };
};
