
import { useWeather } from '@/hooks/useWeather';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import ForecastSection from './ForecastSection';
import WeatherCharts from './WeatherCharts';
import WeatherMap from './WeatherMap';
import { Skeleton } from '@/components/ui/skeleton';

const WeatherDashboard = () => {
  const { 
    weatherData, 
    loading, 
    error, 
    currentMapLayer, 
    loadWeatherByCity, 
    loadWeatherByLocation, 
    changeMapLayer 
  } = useWeather();

  // Loading skeleton
  if (loading || !weatherData) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <SearchBar 
          onSearch={loadWeatherByCity} 
          onUseLocation={loadWeatherByLocation} 
          isLoading={loading} 
        />
        
        <Skeleton className="w-full h-64 rounded-xl" />
        <Skeleton className="w-full h-48 rounded-xl" />
        <Skeleton className="w-full h-60 rounded-xl" />
        <Skeleton className="w-full h-60 rounded-xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SearchBar 
          onSearch={loadWeatherByCity} 
          onUseLocation={loadWeatherByLocation} 
          isLoading={loading} 
        />
        
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-gray-600">Please try searching for a different location</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 mb-10">
      <SearchBar 
        onSearch={loadWeatherByCity} 
        onUseLocation={loadWeatherByLocation} 
        isLoading={loading} 
      />
      
      <CurrentWeather data={weatherData} />
      
      <ForecastSection forecastDays={weatherData.forecast.forecastday} />
      
      <WeatherCharts forecastDays={weatherData.forecast.forecastday} />
      
      <WeatherMap 
        lat={weatherData.location.lat} 
        lon={weatherData.location.lon} 
        currentLayer={currentMapLayer}
        onChangeLayer={changeMapLayer}
      />
    </div>
  );
};

export default WeatherDashboard;
