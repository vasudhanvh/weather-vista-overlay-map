
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, RotateCw } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onUseLocation: () => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, onUseLocation, isLoading }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white/80 border-0 shadow-sm"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onUseLocation} 
          disabled={isLoading}
          className="bg-white/80 border-0 hover:bg-white"
          title="Use my location"
        >
          {isLoading ? <RotateCw className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
