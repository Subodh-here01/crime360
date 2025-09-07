import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin, Layers, Filter, Database, Zap, TrendingUp } from 'lucide-react';
import { elasticsearchService } from '../services/ElasticsearchService';

interface CrimeHeatmapProps {
  location: string;
}

export function CrimeHeatmap({ location }: CrimeHeatmapProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showLegend, setShowLegend] = useState(true);
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const crimeTypes = [
    { id: 'all', label: 'All Crimes', color: 'bg-gradient-to-r from-red-500 to-yellow-500' },
    { id: 'theft', label: 'Theft', color: 'bg-red-500' },
    { id: 'assault', label: 'Assault', color: 'bg-orange-500' },
    { id: 'fraud', label: 'Fraud', color: 'bg-yellow-500' },
    { id: 'vehicle', label: 'Vehicle Crime', color: 'bg-blue-500' },
  ];

  const loadHeatmapData = async () => {
    setIsLoading(true);
    try {
      // Get geospatial aggregated data from Elasticsearch
      const data = await elasticsearchService.getCrimeHeatmapData();
      setHeatmapData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load heatmap data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHeatmapData();
  }, [location]);

  if (!heatmapData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading geospatial crime data...</p>
        </div>
      </div>
    );
  }

  // Convert geospatial coordinates to screen coordinates (simplified)
  const convertToScreenCoords = (lat: number, lon: number) => {
    // Mock conversion for demonstration
    const baseLatitude = 13.0; // Mumbai approximate center
    const baseLongitude = 72.5;
    const x = ((lon - baseLongitude) * 1000) % 100;
    const y = ((lat - baseLatitude) * 1000) % 100;
    return { 
      x: Math.max(10, Math.min(90, x < 0 ? x + 100 : x)), 
      y: Math.max(10, Math.min(90, y < 0 ? y + 100 : y)) 
    };
  };

  const crimePoints = heatmapData.points.map((point: any, index: number) => {
    const screenCoords = convertToScreenCoords(point.lat, point.lon);
    return {
      id: index,
      x: screenCoords.x,
      y: screenCoords.y,
      intensity: point.weight >= 3 ? 'high' : point.weight >= 2 ? 'medium' : 'low',
      type: point.type.toLowerCase().replace(' ', ''),
      count: point.count,
      originalLat: point.lat,
      originalLon: point.lon
    };
  });

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'bg-red-500/80';
      case 'medium': return 'bg-orange-500/60';
      case 'low': return 'bg-yellow-500/40';
      default: return 'bg-gray-500/30';
    }
  };

  const getIntensitySize = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'w-8 h-8';
      case 'medium': return 'w-6 h-6';
      case 'low': return 'w-4 h-4';
      default: return 'w-3 h-3';
    }
  };

  const filteredPoints = selectedFilter === 'all' 
    ? crimePoints 
    : crimePoints.filter(point => point.type === selectedFilter);

  return (
    <div className="space-y-4">
      {/* Enhanced Controls with Elasticsearch Integration */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-600">Elasticsearch Geospatial Aggregation</span>
          <Badge variant="secondary" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadHeatmapData}
            disabled={isLoading}
          >
            <TrendingUp className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
          >
            <Layers className="w-4 h-4 mr-2" />
            {showLegend ? 'Hide' : 'Show'} Legend
          </Button>
        </div>
      </div>

      {/* Crime Type Filters */}
      <div className="flex flex-wrap gap-2">
        {crimeTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setSelectedFilter(type.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedFilter === type.id
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${type.color}`}></div>
              <span>{type.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
        {/* Background Map Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Street grid pattern */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#666" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              
              {/* Mock streets */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="#999" strokeWidth="1"/>
              <line x1="0" y1="50" x2="100" y2="50" stroke="#999" strokeWidth="1"/>
              <line x1="0" y1="80" x2="100" y2="80" stroke="#999" strokeWidth="1"/>
              <line x1="30" y1="0" x2="30" y2="100" stroke="#999" strokeWidth="1"/>
              <line x1="70" y1="0" x2="70" y2="100" stroke="#999" strokeWidth="1"/>
            </svg>
          </div>
        </div>

        {/* Location Label */}
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-md">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-900 capitalize">{location}</span>
          </div>
        </div>

        {/* Crime Points */}
        {filteredPoints.map(point => (
          <div
            key={point.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full ${getIntensityColor(point.intensity)} ${getIntensitySize(point.intensity)} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {point.count} {point.type} incidents
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
            </div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        ))}

        {/* Intensity Legend */}
        {showLegend && (
          <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Crime Density</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500/80 rounded-full"></div>
                <span className="text-xs text-gray-600">High (10+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500/60 rounded-full"></div>
                <span className="text-xs text-gray-600">Medium (5-9)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500/40 rounded-full"></div>
                <span className="text-xs text-gray-600">Low (1-4)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Summary with Elasticsearch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Crime Hotspots</span>
            <span className="font-semibold">{filteredPoints.length}</span>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Incidents</span>
            <span className="font-semibold">{heatmapData.total}</span>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-semibold">{lastUpdated.toLocaleTimeString()}</span>
          </div>
        </Card>
      </div>

      {/* Aggregation Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Geospatial Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Top Crime Types</h4>
              <div className="space-y-1">
                {heatmapData.typeAggregation.slice(0, 3).map((type: any, index: number) => (
                  <div key={type.key} className="flex justify-between text-xs">
                    <span>{type.key}</span>
                    <span className="font-medium">{type.doc_count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Priority Levels</h4>
              <div className="space-y-1">
                {heatmapData.priorityAggregation.map((priority: any, index: number) => (
                  <div key={priority.key} className="flex justify-between text-xs">
                    <span>{priority.key}</span>
                    <span className="font-medium">{priority.doc_count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Case Status</h4>
              <div className="space-y-1">
                {heatmapData.statusAggregation.map((status: any, index: number) => (
                  <div key={status.key} className="flex justify-between text-xs">
                    <span>{status.key}</span>
                    <span className="font-medium">{status.doc_count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}