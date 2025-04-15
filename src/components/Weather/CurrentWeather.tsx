
import { WeatherData } from '@/types/weather';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, Droplets, Sun, Thermometer } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const { current, location } = data;
  
  // Format the local time
  const localTime = new Date(location.localtime).toLocaleString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="weather-card bg-gradient-to-br from-weather-purple/80 to-weather-blue/80 text-white overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-1">
              {location.name}
            </h2>
            <p className="text-sm text-white/80 mb-4">
              {location.region ? `${location.region}, ` : ''}{location.country}
            </p>
            <p className="text-sm font-medium">{localTime}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <img 
              src={`https:${current.condition.icon}`} 
              alt={current.condition.text}
              className="w-24 h-24 object-contain"
            />
            <p className="text-xl font-medium text-center mt-1">{current.condition.text}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold">{Math.round(current.temp_c)}°</span>
            <span className="text-lg text-white/80">
              Feels like {Math.round(current.feelslike_c)}°
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-white/80" />
            <div>
              <p className="text-sm text-white/80">Wind</p>
              <p className="font-medium">{current.wind_kph} km/h</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-white/80" />
            <div>
              <p className="text-sm text-white/80">Humidity</p>
              <p className="font-medium">{current.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-white/80" />
            <div>
              <p className="text-sm text-white/80">UV Index</p>
              <p className="font-medium">{current.uv}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-white/80" />
            <div>
              <p className="text-sm text-white/80">Pressure</p>
              <p className="font-medium">{current.pressure_mb} mb</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
