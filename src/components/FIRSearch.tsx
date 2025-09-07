import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Search, FileText, Calendar, MapPin, User, Filter, Download, Database, Zap, TrendingUp } from 'lucide-react';
import { elasticsearchService, FIRDocument, SearchQuery } from '../services/ElasticsearchService';

export function FIRSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [searchResults, setSearchResults] = useState<FIRDocument[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    setCurrentPage(0);
    
    try {
      const query: SearchQuery = {
        query: searchQuery.trim() || undefined,
        filters: {
          status: statusFilter.length > 0 ? statusFilter : undefined,
          type: typeFilter.length > 0 ? typeFilter : undefined,
          priority: priorityFilter.length > 0 ? priorityFilter : undefined,
          dateRange: dateRange.from && dateRange.to ? dateRange : undefined
        },
        sort: [{ field: 'timestamp', order: 'desc' }],
        size: 10,
        from: 0
      };

      const response = await elasticsearchService.searchFIRs(query);
      setSearchResults(response.hits.hits.map(hit => hit._source));
      setTotalResults(response.hits.total);
      setSearchTime(response.took);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (filterType: 'status' | 'type' | 'priority', value: string, checked: boolean) => {
    const setFilter = filterType === 'status' ? setStatusFilter : 
                     filterType === 'type' ? setTypeFilter : setPriorityFilter;
    
    setFilter(prev => 
      checked 
        ? [...prev, value]
        : prev.filter(item => item !== value)
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setTypeFilter([]);
    setPriorityFilter([]);
    setDateRange({ from: '', to: '' });
    setSearchResults([]);
    setTotalResults(0);
  };

  // Auto-search when filters change
  useEffect(() => {
    if (statusFilter.length > 0 || typeFilter.length > 0 || priorityFilter.length > 0 || dateRange.from || dateRange.to) {
      handleSearch();
    }
  }, [statusFilter, typeFilter, priorityFilter, dateRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'secondary';
      case 'Under Investigation': return 'outline';
      case 'Pending': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search Controls with Elasticsearch Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Elasticsearch-Powered FIR Search</span>
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Elastic Stack
            </Badge>
          </CardTitle>
          <CardDescription>
            Advanced full-text search with real-time indexing and aggregations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Bar */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Full-Text Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search-query"
                placeholder="Search across all fields: FIR number, names, description, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </Button>
            <div className="flex items-center space-x-2">
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Filters */}
                <div className="space-y-3">
                  <Label className="font-medium">Status</Label>
                  <div className="space-y-2">
                    {['Pending', 'Under Investigation', 'Resolved', 'Closed'].map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={statusFilter.includes(status)}
                          onCheckedChange={(checked) => 
                            handleFilterChange('status', status, checked as boolean)
                          }
                        />
                        <Label htmlFor={`status-${status}`} className="text-sm">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crime Type Filters */}
                <div className="space-y-3">
                  <Label className="font-medium">Crime Type</Label>
                  <div className="space-y-2">
                    {['Theft', 'Vehicle Theft', 'Fraud', 'Assault', 'Burglary'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={typeFilter.includes(type)}
                          onCheckedChange={(checked) => 
                            handleFilterChange('type', type, checked as boolean)
                          }
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Filters */}
                <div className="space-y-3">
                  <Label className="font-medium">Priority</Label>
                  <div className="space-y-2">
                    {['Low', 'Medium', 'High', 'Critical'].map(priority => (
                      <div key={priority} className="flex items-center space-x-2">
                        <Checkbox
                          id={`priority-${priority}`}
                          checked={priorityFilter.includes(priority)}
                          onCheckedChange={(checked) => 
                            handleFilterChange('priority', priority, checked as boolean)
                          }
                        />
                        <Label htmlFor={`priority-${priority}`} className="text-sm">
                          {priority}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date Range Filter */}
              <Separator />
              <div className="space-y-3">
                <Label className="font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-from" className="text-sm">From</Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to" className="text-sm">To</Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Statistics */}
          {totalResults > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
              <span>
                Found <strong>{totalResults}</strong> results in <strong>{searchTime}ms</strong>
              </span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Powered by Elasticsearch</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </div>

          <div className="space-y-4">
            {searchResults.map(fir => (
              <Card key={fir.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-600">{fir.firNumber}</h4>
                        <p className="text-sm text-gray-600">{fir.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(fir.status) as any}>
                        {fir.status}
                      </Badge>
                      <Badge variant={getPriorityColor(fir.priority) as any}>
                        {fir.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Complainant:</strong> {fir.complainant.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Accused:</strong> {fir.accused.name}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Date:</strong> {fir.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Location:</strong> {fir.location.area}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Description:</strong> {fir.description}
                    </p>
                  </div>

                  {/* Keywords/Tags */}
                  {fir.keywords && fir.keywords.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-medium text-gray-600">Keywords:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {fir.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evidence */}
                  {fir.evidence && fir.evidence.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-medium text-gray-600">Evidence:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {fir.evidence.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Investigating Officer: {fir.officer}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        View in Kibana
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Index
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && searchQuery && !isSearching && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No FIRs Found</h3>
            <p className="text-gray-600">
              No FIR records match your search criteria. Try adjusting your search terms or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}