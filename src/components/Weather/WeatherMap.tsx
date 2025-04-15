
import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { MapLayerType } from '@/types/weather';
import { OPEN_WEATHER_MAP_KEY } from '@/services/weatherApi';

interface WeatherMapProps {
  lat: number;
  lon: number;
  currentLayer: MapLayerType;
  onChangeLayer: (layer: MapLayerType) => void;
}

// Import leaflet dynamically in useEffect to avoid SSR issues
const WeatherMap = ({ lat, lon, currentLayer, onChangeLayer }: WeatherMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const weatherLayerRef = useRef<any>(null);

  const layerLabels: Record<MapLayerType, string> = {
    'temp_new': 'Temperature',
    'clouds_new': 'Clouds',
    'precipitation_new': 'Precipitation',
    'pressure_new': 'Pressure',
    'wind_new': 'Wind Speed',
  };

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Dynamically import Leaflet
      const L = await import('leaflet');
      
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lon], 8);

      // Add the base tile layer
      L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Add the weather overlay layer
      weatherLayerRef.current = L.tileLayer(
        `https://tile.openweathermap.org/map/${currentLayer}/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_MAP_KEY}`,
        {
          attribution: 'Weather data © OpenWeatherMap',
          maxZoom: 18,
          opacity: 0.7
        }
      ).addTo(mapInstanceRef.current);

      // Add a marker for the location
      const locationMarker = L.marker([lat, lon]).addTo(mapInstanceRef.current);
      locationMarker.bindPopup(`<b>Your Location</b><br>${lat.toFixed(4)}, ${lon.toFixed(4)}`).openPopup();
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon]);

  // Update the weather layer when it changes
  useEffect(() => {
    if (weatherLayerRef.current) {
      weatherLayerRef.current.setUrl(
        `https://tile.openweathermap.org/map/${currentLayer}/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_MAP_KEY}`
      );
    }
  }, [currentLayer]);

  // Update map when lat/lon changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 8);
      
      // Also update the marker
      const L = window.L;
      if (L) {
        // Clear all layers except the base tile layer
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });
        
        // Add a new marker
        const locationMarker = L.marker([lat, lon]).addTo(mapInstanceRef.current);
        locationMarker.bindPopup(`<b>Current Location</b><br>${lat.toFixed(4)}, ${lon.toFixed(4)}`).openPopup();
      }
    }
  }, [lat, lon]);

  return (
    <Card className="weather-card animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Weather Map</h2>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm">{lat.toFixed(2)}, {lon.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {Object.entries(layerLabels).map(([layer, label]) => (
              <Button
                key={layer}
                onClick={() => onChangeLayer(layer as MapLayerType)}
                variant={currentLayer === layer ? "default" : "outline"}
                size="sm"
                className={
                  currentLayer === layer
                    ? "map-control-btn active"
                    : "map-control-btn"
                }
              >
                {label}
              </Button>
            ))}
          </div>
          
          <div 
            ref={mapRef} 
            className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200"
            style={{ zIndex: 0 }}
          />
          
          <div className="text-xs text-gray-500 text-center mt-2">
            Weather data provided by OpenWeatherMap | Map data © OpenStreetMap contributors
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherMap;
