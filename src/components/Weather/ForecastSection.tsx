
import { ForecastDay, HourForecast } from '@/types/weather';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
           now.getMonth() === hourTime.getMonth() &&
           now.getFullYear() === hourTime.getFullYear();
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
      <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto mb-6 bg-white/50 rounded-full">
        <TabsTrigger value="hourly" className="rounded-full">Hourly</TabsTrigger>
        <TabsTrigger value="daily" className="rounded-full">3-Day Forecast</TabsTrigger>
      </TabsList>
      
      <TabsContent value="hourly" className="mt-0">
        <Card className="weather-card">
          <h2 className="text-lg font-semibold mb-4 pl-2">Next 24 Hours</h2>
          <ScrollArea className="weather-scroll pb-6" style={{ height: '300px' }}>
            <div className="flex gap-4 pb-6 px-4 overflow-x-auto min-w-full">
              {getNext24Hours().map((hour, index) => {
                const isCurrent = isCurrentHour(hour.time);
                return (
                  <div 
                    key={index} 
                    className={cn(
                      "forecast-card min-w-[130px] flex flex-col justify-between p-4 rounded-xl transition-all duration-300",
                      isCurrent 
                        ? "bg-gradient-to-b from-weather-purple/25 to-weather-blue/30 border-2 border-weather-blue shadow-lg scale-[1.03] transform"
                        : "hover:shadow-md hover:bg-white/70 bg-white/60"
                    )}
                  >
                    <div className="relative">
                      <p className={cn(
                        "font-medium mb-1 text-center", 
                        isCurrent ? "text-weather-blue font-bold" : ""
                      )}>
                        {isCurrent ? 'Now' : formatHour(hour.time)}
                      </p>
                      {isCurrent && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-weather-blue rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="flex justify-center my-2">
                      <img 
                        src={`https:${hour.condition.icon}`} 
                        alt={hour.condition.text}
                        className={cn(
                          "w-14 h-14 transition-transform", 
                          isCurrent ? "scale-110 drop-shadow-md" : ""
                        )}
                      />
                    </div>
                    <p className={cn(
                      "text-2xl font-semibold text-center", 
                      isCurrent ? "text-weather-blue" : ""
                    )}>
                      {Math.round(hour.temp_c)}°
                    </p>
                    <div className={cn(
                      "text-xs mt-1 text-center",
                      isCurrent ? "text-gray-700 font-medium" : "text-gray-500"
                    )}>
                      {hour.condition.text}
                    </div>
                    <div className="text-xs mt-3 flex justify-between font-medium">
                      <span>{hour.chance_of_rain}% 💧</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forecastDays.map((day, index) => {
              const isToday = new Date(day.date).toDateString() === new Date().toDateString();
              return (
                <div 
                  key={index} 
                  className={cn(
                    "forecast-card flex flex-col h-full justify-between p-5 rounded-xl transition-all duration-300",
                    isToday 
                      ? "bg-gradient-to-b from-weather-purple/25 to-weather-blue/30 border-2 border-weather-blue shadow-lg" 
                      : "hover:shadow-md hover:bg-white/70 bg-white/60"
                  )}
                >
                  <div>
                    <p className="font-semibold text-lg">{isToday ? 'Today' : formatDate(day.date)}</p>
                    <div className="flex justify-center my-3">
                      <img 
                        src={`https:${day.day.condition.icon}`} 
                        alt={day.day.condition.text}
                        className={cn(
                          "w-16 h-16 transition-transform", 
                          isToday ? "scale-110" : ""
                        )}
                      />
                    </div>
                    <p className="text-lg font-normal mb-2">{day.day.condition.text}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={cn(
                        "text-2xl font-bold", 
                        isToday ? "text-weather-blue" : ""
                      )}>
                        {Math.round(day.day.maxtemp_c)}°
                      </span>
                      <span className="text-lg text-gray-500">{Math.round(day.day.mintemp_c)}°</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                      <div>
                        <p className="text-gray-500 font-medium">Rain</p>
                        <p>{day.day.daily_chance_of_rain}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Wind</p>
                        <p>{Math.round(day.day.maxwind_kph)} km/h</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Humidity</p>
                        <p>{day.day.avghumidity}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">UV Index</p>
                        <p>{day.day.uv}</p>
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
