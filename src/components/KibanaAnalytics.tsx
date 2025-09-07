import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Database, TrendingUp, MapPin, Clock, AlertTriangle, Filter, Calendar, Download, RefreshCw } from 'lucide-react';
import { elasticsearchService } from '../services/ElasticsearchService';

export function KibanaAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const timeRanges = [
    { value: '1d', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
  ];

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // Calculate date range
      const now = new Date();
      const days = parseInt(timeRange.replace('d', ''));
      const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      const data = await elasticsearchService.getAnalytics({
        from: from.toISOString(),
        to: now.toISOString()
      });
      
      setAnalytics(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#f97316'];

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading Kibana Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-semibold">Kibana Analytics Dashboard</h2>
            <p className="text-gray-600">Real-time crime data insights powered by Elasticsearch</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Crimes</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalCrimes}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Resolution Time</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.averageResolutionTime}d</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Cases</p>
                <p className="text-3xl font-bold text-orange-600">
                  {analytics.crimesByStatus.find((s: any) => s.key === 'Under Investigation')?.doc_count || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolution Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round((analytics.crimesByStatus.find((s: any) => s.key === 'Resolved')?.doc_count || 0) / analytics.totalCrimes * 100)}%
                </p>
              </div>
              <Database className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crime Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Crime Types Distribution</CardTitle>
                <CardDescription>Breakdown by crime category</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.crimesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ key, doc_count }) => `${key}: ${doc_count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="doc_count"
                      >
                        {analytics.crimesByType.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Case Status Distribution</CardTitle>
                <CardDescription>Current status of all cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.crimesByStatus}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="key" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="doc_count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>Cases categorized by priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.crimesByPriority} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="key" type="category" />
                    <Tooltip />
                    <Bar dataKey="doc_count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Time Series */}
          <Card>
            <CardHeader>
              <CardTitle>Crime Trends Over Time</CardTitle>
              <CardDescription>Daily crime reporting trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          {/* Location Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Crime Hotspots</CardTitle>
              <CardDescription>Geographic distribution of crimes</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.crimesByLocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="doc_count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Top Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Top Keywords</CardTitle>
              <CardDescription>Most frequently mentioned terms in FIRs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topKeywords.map((keyword: any, index: number) => (
                  <div key={keyword.keyword} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                      <span className="font-medium">{keyword.keyword}</span>
                    </div>
                    <Badge variant="secondary">
                      {keyword.count} mentions
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        <p>Last updated: {lastUpdated.toLocaleString()} • Powered by Elasticsearch & Kibana</p>
      </div>
    </div>
  );
}