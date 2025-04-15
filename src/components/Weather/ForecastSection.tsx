
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

  // Check if the hour is current - improved logic to match current hour more accurately
  const isCurrentHour = (timeString: string) => {
    const now = new Date();
    const hourTime = new Date(timeString);
    
    // Compare year, month, day, and hour for more accurate matching
    return now.getFullYear() === hourTime.getFullYear() &&
           now.getMonth() === hourTime.getMonth() &&
           now.getDate() === hourTime.getDate() &&
           now.getHours() === hourTime.getHours();
  };

  // Check if the day is today
  const isToday = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    return now.getDate() === date.getDate() && 
           now.getMonth() === date.getMonth() &&
           now.getFullYear() === date.getFullYear();
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
      <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto mb-4 bg-purple-100/50">
        <TabsTrigger value="hourly">Hourly</TabsTrigger>
        <TabsTrigger value="daily">3-Day Forecast</TabsTrigger>
      </TabsList>
      
      <TabsContent value="hourly" className="mt-0">
        <Card className="weather-card">
          <h2 className="text-lg font-semibold mb-4 pl-2">Next 24 Hours</h2>
          <ScrollArea className="weather-scroll">
            <div className="flex gap-3 pb-4 px-2">
              {getNext24Hours().map((hour, index) => {
                const isCurrentHourItem = isCurrentHour(hour.time);
                return (
                  <div 
                    key={index} 
                    className={`forecast-card min-w-[100px] ${
                      isCurrentHourItem 
                        ? 'bg-gradient-to-br from-purple-500/80 to-blue-500/80 text-white ring-2 ring-purple-500/70' 
                        : ''
                    }`}
                  >
                    <p className={`font-medium mb-1 ${isCurrentHourItem ? 'text-white' : ''}`}>
                      {formatHour(hour.time)}
                      {isCurrentHourItem && <span className="ml-1 text-xs font-bold">• Now</span>}
                    </p>
                    <div className="flex justify-center">
                      <img 
                        src={hour.condition.icon.startsWith('//') ? `https:${hour.condition.icon}` : hour.condition.icon} 
                        alt={hour.condition.text}
                        className="w-10 h-10"
                      />
                    </div>
                    <p className={`text-xl font-semibold mt-1 ${isCurrentHourItem ? 'text-white' : ''}`}>
                      {Math.round(hour.temp_c)}°
                    </p>
                    <div className={`text-xs ${isCurrentHourItem ? 'text-white/90' : 'text-gray-500'} mt-1`}>
                      {hour.condition.text}
                    </div>
                    <div className={`text-xs mt-2 flex justify-between ${isCurrentHourItem ? 'text-white/90' : 'text-gray-500'}`}>
                      <span>{hour.chance_of_rain}% rain</span>
                      <span>{hour.wind_kph} km/h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
      </TabsContent>
      
      <TabsContent value="daily" className="mt-0">
        <Card className="weather-card">
          <h2 className="text-lg font-semibold mb-4 pl-2">3-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecastDays.map((day, index) => {
              const isTodayItem = isToday(day.date);
              return (
                <div 
                  key={index} 
                  className={`forecast-card flex flex-col h-full justify-between ${
                    isTodayItem 
                      ? 'bg-gradient-to-br from-weather-purple/80 to-weather-blue/80 text-white ring-2 ring-weather-purple/70' 
                      : ''
                  }`}
                >
                  <div>
                    <p className={`font-semibold text-lg ${isTodayItem ? 'text-white' : ''}`}>
                      {formatDate(day.date)}
                      {isTodayItem && <span className="ml-2 text-xs font-bold">• Today</span>}
                    </p>
                    <div className="flex justify-center my-3">
                      <img 
                        src={`https:${day.day.condition.icon}`} 
                        alt={day.day.condition.text}
                        className="w-16 h-16"
                      />
                    </div>
                    <p className={`text-lg font-normal mb-2 ${isTodayItem ? 'text-white' : ''}`}>
                      {day.day.condition.text}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-2xl font-bold ${isTodayItem ? 'text-white' : ''}`}>
                        {Math.round(day.day.maxtemp_c)}°
                      </span>
                      <span className={`text-lg ${isTodayItem ? 'text-white/80' : 'text-gray-500'}`}>
                        {Math.round(day.day.mintemp_c)}°
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <p className={isTodayItem ? 'text-white/80' : 'text-gray-500'}>Rain</p>
                        <p className={isTodayItem ? 'text-white' : ''}>{day.day.daily_chance_of_rain}%</p>
                      </div>
                      <div>
                        <p className={isTodayItem ? 'text-white/80' : 'text-gray-500'}>Wind</p>
                        <p className={isTodayItem ? 'text-white' : ''}>{Math.round(day.day.maxwind_kph)} km/h</p>
                      </div>
                      <div>
                        <p className={isTodayItem ? 'text-white/80' : 'text-gray-500'}>Humidity</p>
                        <p className={isTodayItem ? 'text-white' : ''}>{day.day.avghumidity}%</p>
                      </div>
                      <div>
                        <p className={isTodayItem ? 'text-white/80' : 'text-gray-500'}>UV Index</p>
                        <p className={isTodayItem ? 'text-white' : ''}>{day.day.uv}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ForecastSection;
