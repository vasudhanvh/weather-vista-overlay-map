
import { ForecastDay } from '@/types/weather';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CartesianGrid, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

interface WeatherChartsProps {
  forecastDays: ForecastDay[];
}

const WeatherCharts = ({ forecastDays }: WeatherChartsProps) => {
  // Format dates for labels
  const formatChartDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
    });
  };
  
  // Prepare chart data
  const chartData = forecastDays.map(day => ({
    name: formatChartDate(day.date),
    date: day.date,
    maxTemp: Math.round(day.day.maxtemp_c),
    minTemp: Math.round(day.day.mintemp_c),
    rainfall: Math.round(day.day.totalprecip_mm * 10) / 10,
    chanceOfRain: day.day.daily_chance_of_rain,
  }));

  // Chart configs
  const chartConfig = {
    temperature: {
      max: { label: 'Max Temperature °C', theme: { light: '#ff7043', dark: '#ff5722' } },
      min: { label: 'Min Temperature °C', theme: { light: '#33C3F0', dark: '#00b8d4' } }
    },
    precipitation: {
      rainfall: { label: 'Rainfall (mm)', theme: { light: 'rgba(51, 153, 255, 0.8)', dark: 'rgba(30, 136, 229, 0.8)' } },
      chanceOfRain: { label: 'Chance of Rain (%)', theme: { light: '#9b87f5', dark: '#7c4dff' } }
    }
  };

  // Generate hourly temperature data
  const getHourlyTempData = () => {
    const today = forecastDays[0];
    const hours = today.hour;
    const now = new Date();
    
    return hours
      .filter(h => {
        const hourTime = new Date(h.time);
        return hourTime.getHours() >= now.getHours() || hourTime.getDate() > now.getDate();
      })
      .slice(0, 12)
      .map(h => ({
        name: new Date(h.time).toLocaleTimeString(undefined, { hour: '2-digit' }),
        temp: Math.round(h.temp_c),
        feelsLike: Math.round(h.feelslike_c),
        time: h.time
      }));
  };

  const hourlyData = getHourlyTempData();
  
  const hourlyChartConfig = {
    temp: { label: 'Temperature °C', theme: { light: '#ff7043', dark: '#ff5722' } },
    feelsLike: { label: 'Feels Like °C', theme: { light: '#9b87f5', dark: '#7c4dff' } }
  };

  return (
    <Card className="weather-card animate-fade-in">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Weather Charts</h2>
        
        <Tabs defaultValue="hourly" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6 bg-white/50 rounded-full">
            <TabsTrigger value="hourly" className="rounded-full">Hourly</TabsTrigger>
            <TabsTrigger value="temperature" className="rounded-full">Temperature</TabsTrigger>
            <TabsTrigger value="precipitation" className="rounded-full">Precipitation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hourly" className="mt-4">
            <div className="h-[340px] mt-4">
              <ChartContainer config={hourlyChartConfig}>
                <AreaChart data={hourlyData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff7043" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff7043" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorFeelsLike" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#555', fontSize: 12 }}
                    tickMargin={10}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#555', fontSize: 12 }}
                    tickMargin={10}
                    axisLine={{ stroke: '#E2E8F0' }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="temp" 
                    fill="url(#colorTemp)" 
                    stroke="#ff7043" 
                    strokeWidth={2}
                    dot={{ fill: '#ff7043', stroke: 'white', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="feelsLike" 
                    fill="url(#colorFeelsLike)" 
                    stroke="#9b87f5" 
                    strokeWidth={2}
                    dot={{ fill: '#9b87f5', stroke: 'white', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 20 }}
                    iconType="circle"
                    iconSize={8}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="temperature" className="mt-4">
            <div className="h-[340px] mt-4">
              <ChartContainer config={chartConfig.temperature}>
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                  <defs>
                    <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff7043" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff7043" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#33C3F0" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#33C3F0" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#555', fontSize: 12 }}
                    tickMargin={10}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#555', fontSize: 12 }}
                    tickMargin={10}
                    axisLine={{ stroke: '#E2E8F0' }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="maxTemp" 
                    fill="url(#colorMax)" 
                    stroke="#ff7043" 
                    strokeWidth={2}
                    dot={{ fill: '#ff7043', stroke: 'white', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="minTemp" 
                    fill="url(#colorMin)" 
                    stroke="#33C3F0" 
                    strokeWidth={2}
                    dot={{ fill: '#33C3F0', stroke: 'white', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 20 }}
                    iconType="circle"
                    iconSize={8}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="precipitation" className="mt-4">
            <div className="h-[340px] mt-4">
              <ChartContainer config={chartConfig.precipitation}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#555', fontSize: 12 }}
                    tickMargin={10}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fill: '#555', fontSize: 12 }}
                    tickMargin={10}
                    domain={[0, dataMax => Math.max(5, Math.ceil(dataMax * 1.2))]}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fill: '#555', fontSize: 12 }}
                    tickMargin={10}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="rainfall" 
                    yAxisId="left"
                    fill="rgba(51, 153, 255, 0.8)" 
                    radius={[6, 6, 0, 0]}
                    barSize={36}
                  />
                  <Bar 
                    dataKey="chanceOfRain" 
                    yAxisId="right"
                    fill="#9b87f5" 
                    radius={[6, 6, 0, 0]}
                    barSize={36}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 20 }}
                    iconType="circle"
                    iconSize={8}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherCharts;
