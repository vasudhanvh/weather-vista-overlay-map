
import { useEffect } from 'react';
import WeatherDashboard from '@/components/Weather/WeatherDashboard';
import { Button } from '@/components/ui/button';
import { Cloud, Github } from 'lucide-react';

const Index = () => {
  // Add leaflet CSS dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
    link.crossOrigin = '';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-200">
      <header className="bg-gradient-to-r from-purple-500 to-blue-500 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cloud className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Weather Vista</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-transparent"
              onClick={() => window.open('https://github.com', '_blank')}
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>
        </div>
      </header>

      <main>
        <WeatherDashboard />
      </main>
      
      <footer className="py-6 bg-purple-600/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-white/80">
            Weather data provided by WeatherAPI.com and OpenWeatherMap
          </p>
          <p className="text-sm text-white/50 mt-1">
            © {new Date().getFullYear()} Weather Vista • Built with React and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
