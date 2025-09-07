import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Shield, LogOut, Camera, FileText, Upload, User, Calendar, MapPin } from 'lucide-react';
import { FIRSearch } from './FIRSearch';
import { FacialRecognition } from './FacialRecognition';
import { KibanaAnalytics } from './KibanaAnalytics';

interface PoliceDashboardProps {
  onLogout: () => void;
}

export function PoliceDashboard({ onLogout }: PoliceDashboardProps) {
  const [activeTab, setActiveTab] = useState('fir-search');

  const dashboardStats = {
    totalFIRs: 2847,
    pendingCases: 156,
    resolvedToday: 23,
    faceMatches: 45
  };

  const recentFIRs = [
    { id: 'FIR001234', type: 'Theft', status: 'Under Investigation', date: '2025-01-08', location: 'Hebbal' },
    { id: 'FIR001235', type: 'Assault', status: 'Pending', date: '2025-01-08', location: 'Cubbon Park' },
    { id: 'FIR001236', type: 'Fraud', status: 'Resolved', date: '2025-01-07', location: 'Kengeri' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'secondary';
      case 'Under Investigation': return 'outline';
      case 'Pending': return 'destructive';
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
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Crime 360</h1>
                <p className="text-sm text-gray-500">Police Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Officer Patel</p>
                <p className="text-xs text-gray-500">Badge: 12345</p>
              </div>
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
          <Card className = "card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total FIRs</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalFIRs}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className = "card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Cases</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.pendingCases}</p>
                </div>
                <Search className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className = "card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved Today</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.resolvedToday}</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className = "card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Face Matches</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.faceMatches}</p>
                </div>
                <Camera className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tools */}
          <div className="lg:col-span-2">
            <Card className = "card">
              <CardHeader>
                <CardTitle>Police Tools</CardTitle>
                <CardDescription>Access FIR search and facial recognition systems</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="fir-search" className="flex items-center space-x-2">
                      <Search className="w-4 h-4" />
                      <span>FIR Search</span>
                    </TabsTrigger>
                    <TabsTrigger value="facial-recognition" className="flex items-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Facial Recognition</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Kibana Analytics</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fir-search" className="mt-6">
                    <FIRSearch />
                  </TabsContent>
                  
                  <TabsContent value="facial-recognition" className="mt-6">
                    <FacialRecognition />
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="mt-6">
                    <KibanaAnalytics />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent FIRs */}
          <div>
            <Card className = "card">
              <CardHeader>
                <CardTitle>Recent FIRs</CardTitle>
                <CardDescription>Latest filed complaints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentFIRs.map(fir => (
                  <div key={fir.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-600">{fir.id}</span>
                      <Badge variant={getStatusColor(fir.status) as any}>
                        {fir.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{fir.type}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{fir.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{fir.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All FIRs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}