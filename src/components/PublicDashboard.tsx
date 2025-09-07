import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, TrendingUp, AlertTriangle, LogOut, Users, Shield } from 'lucide-react';
import { CrimeHeatmap } from './CrimeHeatmap';
import { TopCrimesChart } from './TopCrimesChart';

interface PublicDashboardProps {
  onLogout: () => void;
}

export function PublicDashboard({ onLogout }: PublicDashboardProps) {
  const [selectedLocation, setSelectedLocation] = useState('bangalore');

  const locations = [
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'pune', label: 'Pune' },
  ];

  const crimeStats = {
    total: 1247,
    thisMonth: 89,
    trend: '+12%',
    safetyIndex: 78
  };

  const recentAlerts = [
    { id: 1, type: 'Theft', location: 'Jaynagar', time: '2 hours ago', severity: 'medium' },
    { id: 2, type: 'Vehicle Theft', location: 'Cubbon Park', time: '4 hours ago', severity: 'high' },
    { id: 3, type: 'Pickpocketing', location: 'Kengeri', time: '6 hours ago', severity: 'low' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Crime 360</h1>
                <p className="text-sm text-gray-500">Public Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Crimes</p>
                  <p className="text-2xl font-semibold text-gray-900">{crimeStats.total}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-semibold text-gray-900">{crimeStats.thisMonth}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Trend</p>
                  <p className="text-2xl font-semibold text-red-600">{crimeStats.trend}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Safety Index</p>
                  <p className="text-2xl font-semibold text-green-600">{crimeStats.safetyIndex}/100</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crime Heatmap */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Crime Heatmap - {locations.find(l => l.value === selectedLocation)?.label}</span>
                </CardTitle>
                <CardDescription>
                  Interactive map showing crime density across different areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CrimeHeatmap location={selectedLocation} />
              </CardContent>
            </Card>
          </div>

          {/* Top Crimes and Recent Alerts */}
          <div className="space-y-6">
            {/* Top Crimes Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Top Crime Types</CardTitle>
                <CardDescription>Most reported crimes this month</CardDescription>
              </CardHeader>
              <CardContent>
                <TopCrimesChart />
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest reported incidents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.location}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}