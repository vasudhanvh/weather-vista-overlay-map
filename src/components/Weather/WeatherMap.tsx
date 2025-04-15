
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapLayerType } from '@/types/weather';
import { OPEN_WEATHER_MAP_KEY } from '@/services/weatherApi';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherMapProps {
  lat: number;
  lon: number;
  currentLayer: MapLayerType;
  onChangeLayer: (layer: MapLayerType) => void;
}

const layerLabels: Record<MapLayerType, string> = {
  'temp_new': 'Temperature',
  'clouds_new': 'Clouds',
  'precipitation_new': 'Precipitation',
  'pressure_new': 'Pressure',
  'wind_new': 'Wind Speed'
};

const WeatherMap = ({ lat, lon, currentLayer, onChangeLayer }: WeatherMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Check if Leaflet is loaded
  useEffect(() => {
    const checkLeaflet = () => {
      if (window.L) {
        setLeafletLoaded(true);
        return true;
      }
      return false;
    };

    if (checkLeaflet()) return;

    // If not loaded yet, set up an interval to check
    const interval = setInterval(() => {
      if (checkLeaflet()) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);
  
  // Initialize map once Leaflet is available
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    
    // Create the map instance if it doesn't exist yet
    if (!mapInstanceRef.current) {
      const L = window.L;
      
      // Create map
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([lat, lon], 8);
      
      // Add the base tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
      
      // Add the weather tile layer
      tileLayerRef.current = L.tileLayer(`https://tile.openweathermap.org/map/${currentLayer}/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_MAP_KEY}`, {
        attribution: '&copy; OpenWeatherMap',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
      
      // Mark map as loaded
      setMapLoaded(true);
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [lat, lon, currentLayer, leafletLoaded]);
  
  // Update the map center when lat/lon changes
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      mapInstanceRef.current.setView([lat, lon], 8);
    }
  }, [lat, lon, mapLoaded]);
  
  // Update the weather layer when it changes
  useEffect(() => {
    if (tileLayerRef.current && mapLoaded && leafletLoaded) {
      // Remove the old layer
      tileLayerRef.current.remove();
      
      // Add the new layer with the updated layer type
      const L = window.L;
      tileLayerRef.current = L.tileLayer(`https://tile.openweathermap.org/map/${currentLayer}/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_MAP_KEY}`, {
        attribution: '&copy; OpenWeatherMap',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }
  }, [currentLayer, mapLoaded, leafletLoaded]);

  return (
    <Card className="weather-card overflow-hidden animate-fade-in">
      <div className="p-4 pb-0">
        <h2 className="text-lg font-semibold mb-4">Weather Map</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(layerLabels).map(([layer, label]) => (
            <button
              key={layer}
              onClick={() => onChangeLayer(layer as MapLayerType)}
              className={`map-control-btn ${currentLayer === layer ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {!leafletLoaded || !mapLoaded ? (
        <Skeleton className="h-[400px] rounded-none" />
      ) : (
        <div 
          ref={mapContainerRef}
          className="h-[400px] w-full z-0" 
        />
      )}
    </Card>
  );
};

export default WeatherMap;
