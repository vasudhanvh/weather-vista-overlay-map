
import { ForecastDay, HourForecast } from '@/types/weather';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface ForecastSectionProps {
  forecastDays: ForecastDay[];
}

const ForecastSection = ({ forecastDays }: ForecastSectionProps) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format hour for display
  const formatHour = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Check if the hour is current
  const isCurrentHour = (timeString: string) => {
    const now = new Date();
    const hourTime = new Date(timeString);
    return now.getHours() === hourTime.getHours() && 
           now.getDate() === hourTime.getDate() &&
           now.getMonth() === hourTime.getMonth();
  };

  // Get only the next 24 hours from now
  const getNext24Hours = (): HourForecast[] => {
    const now = new Date();
    const allHours: HourForecast[] = [];
    
    forecastDays.forEach(day => {
      allHours.push(...day.hour);
    });
    
    return allHours.filter(hour => {
      const hourDate = new Date(hour.time);
      return hourDate >= now && hourDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000);
    });
  };

  return (
    <Tabs defaultValue="hourly" className="w-full animate-fade-in">
      <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto mb-4 bg-white/50">
        <TabsTrigger value="hourly">Hourly</TabsTrigger>
        <TabsTrigger value="daily">3-Day Forecast</TabsTrigger>
      </TabsList>
      
      <TabsContent value="hourly" className="mt-0">
        <Card className="weather-card">
          <h2 className="text-lg font-semibold mb-4 pl-2">Next 24 Hours</h2>
          <ScrollArea className="weather-scroll">
            <div className="flex gap-3 pb-4 px-2">
              {getNext24Hours().map((hour, index) => (
                <div 
                  key={index} 
                  className={`forecast-card min-w-[100px] ${
                    isCurrentHour(hour.time) ? 'ring-2 ring-primary/70' : ''
                  }`}
                >
                  <p className="font-medium mb-1">{formatHour(hour.time)}</p>
                  <div className="flex justify-center">
                    <img 
                      src={`https:${hour.condition.icon}`} 
                      alt={hour.condition.text}
                      className="w-10 h-10"
                    />
                  </div>
                  <p className="text-xl font-semibold mt-1">{Math.round(hour.temp_c)}°</p>
                  <div className="text-xs text-gray-500 mt-1">{hour.condition.text}</div>
                  <div className="text-xs mt-2 flex justify-between">
                    <span>{hour.chance_of_rain}% rain</span>
                    <span>{hour.wind_kph} km/h</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </TabsContent>
      
      <TabsContent value="daily" className="mt-0">
        <Card className="weather-card">
          <h2 className="text-lg font-semibold mb-4 pl-2">3-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecastDays.map((day, index) => (
              <div key={index} className="forecast-card flex flex-col h-full justify-between">
                <div>
                  <p className="font-semibold text-lg">{formatDate(day.date)}</p>
                  <div className="flex justify-center my-3">
                    <img 
                      src={`https:${day.day.condition.icon}`} 
                      alt={day.day.condition.text}
                      className="w-16 h-16"
                    />
                  </div>
                  <p className="text-lg font-normal mb-2">{day.day.condition.text}</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold">{Math.round(day.day.maxtemp_c)}°</span>
                    <span className="text-lg text-gray-500">{Math.round(day.day.mintemp_c)}°</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                    <div>
                      <p className="text-gray-500">Rain</p>
                      <p>{day.day.daily_chance_of_rain}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Wind</p>
                      <p>{Math.round(day.day.maxwind_kph)} km/h</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Humidity</p>
                      <p>{day.day.avghumidity}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">UV Index</p>
                      <p>{day.day.uv}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ForecastSection;
