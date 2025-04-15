
import { useEffect, useRef } from 'react';
import { ForecastDay } from '@/types/weather';
import { Card, CardContent } from '@/components/ui/card';
import { Chart, registerables } from 'chart.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Register Chart.js components
Chart.register(...registerables);

interface WeatherChartsProps {
  forecastDays: ForecastDay[];
}

const WeatherCharts = ({ forecastDays }: WeatherChartsProps) => {
  const maxTempChartRef = useRef<HTMLCanvasElement | null>(null);
  const minTempChartRef = useRef<HTMLCanvasElement | null>(null);
  const rainChartRef = useRef<HTMLCanvasElement | null>(null);
  
  // Chart instances refs
  const maxTempChartInstance = useRef<Chart | null>(null);
  const minTempChartInstance = useRef<Chart | null>(null);
  const rainChartInstance = useRef<Chart | null>(null);

  // Format dates for labels
  const formatChartDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Initialize charts
  useEffect(() => {
    if (!forecastDays.length) return;

    const dates = forecastDays.map(day => formatChartDate(day.date));
    const maxTemps = forecastDays.map(day => day.day.maxtemp_c);
    const minTemps = forecastDays.map(day => day.day.mintemp_c);
    const rainfall = forecastDays.map(day => day.day.totalprecip_mm);

    // Common chart options
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          cornerRadius: 6,
          padding: 10,
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#555',
            font: {
              family: 'Segoe UI, system-ui, sans-serif',
            },
          },
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            color: '#555',
            font: {
              family: 'Segoe UI, system-ui, sans-serif',
            },
          },
        },
      },
    };

    // Destroy existing chart instances
    if (maxTempChartInstance.current) {
      maxTempChartInstance.current.destroy();
    }

    if (minTempChartInstance.current) {
      minTempChartInstance.current.destroy();
    }

    if (rainChartInstance.current) {
      rainChartInstance.current.destroy();
    }

    // Create max temperature chart
    if (maxTempChartRef.current) {
      maxTempChartInstance.current = new Chart(maxTempChartRef.current, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Max Temperature (°C)',
            data: maxTemps,
            borderColor: '#ff7043',
            backgroundColor: 'rgba(255, 112, 67, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#ff7043',
            pointBorderColor: 'white',
            pointRadius: 5,
            pointHoverRadius: 7,
          }]
        },
        options: { ...commonOptions },
      });
    }

    // Create min temperature chart
    if (minTempChartRef.current) {
      minTempChartInstance.current = new Chart(minTempChartRef.current, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Min Temperature (°C)',
            data: minTemps,
            borderColor: '#33C3F0',
            backgroundColor: 'rgba(51, 195, 240, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#33C3F0',
            pointBorderColor: 'white',
            pointRadius: 5,
            pointHoverRadius: 7,
          }]
        },
        options: { ...commonOptions },
      });
    }

    // Create precipitation chart
    if (rainChartRef.current) {
      rainChartInstance.current = new Chart(rainChartRef.current, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [{
            label: 'Precipitation (mm)',
            data: rainfall,
            backgroundColor: 'rgba(51, 153, 255, 0.7)',
            borderColor: 'rgba(51, 153, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: { 
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            title: {
              display: false,
              text: 'Precipitation (mm)',
              font: {
                size: 16,
                weight: 'bold',
              },
            },
          },
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (maxTempChartInstance.current) {
        maxTempChartInstance.current.destroy();
      }
      if (minTempChartInstance.current) {
        minTempChartInstance.current.destroy();
      }
      if (rainChartInstance.current) {
        rainChartInstance.current.destroy();
      }
    };
  }, [forecastDays]);

  return (
    <Card className="weather-card animate-fade-in">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Weather Charts</h2>
        
        <Tabs defaultValue="temperature" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto mb-4 bg-white/50">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="temperature" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              <div className="chart-container" style={{ height: '250px' }}>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Maximum Temperature (°C)</h3>
                <canvas ref={maxTempChartRef}></canvas>
              </div>
              
              <div className="chart-container" style={{ height: '250px' }}>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Minimum Temperature (°C)</h3>
                <canvas ref={minTempChartRef}></canvas>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="precipitation" className="mt-0">
            <div className="chart-container" style={{ height: '300px' }}>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Precipitation (mm)</h3>
              <canvas ref={rainChartRef}></canvas>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherCharts;
