import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';
import { Button } from './ui/button';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const crimeData = [
  { name: 'Theft', count: 45, percentage: 35 },
  { name: 'Vehicle Crime', count: 32, percentage: 25 },
  { name: 'Assault', count: 28, percentage: 22 },
  { name: 'Fraud', count: 15, percentage: 12 },
  { name: 'Vandalism', count: 8, percentage: 6 },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];

export function TopCrimesChart() {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Count: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-gray-600">
            {((payload[0].value / crimeData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-blue-600">
            Count: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-gray-600">
            {payload[0].payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Toggle */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant={chartType === 'bar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('bar')}
          className="flex items-center space-x-1"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Bar</span>
        </Button>
        <Button
          variant={chartType === 'pie' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('pie')}
          className="flex items-center space-x-1"
        >
          <PieChartIcon className="w-4 h-4" />
          <span>Pie</span>
        </Button>
      </div>

      {/* Chart Container */}
      <div style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={crimeData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={crimeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {crimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Crime Statistics */}
      <div className="space-y-2">
        {crimeData.map((crime, index) => (
          <div key={crime.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <span className="text-sm font-medium">{crime.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{crime.count}</span>
              <span className="text-xs text-gray-500">({crime.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 pt-2 border-t">
        Data from last 30 days • Total incidents: {crimeData.reduce((sum, item) => sum + item.count, 0)}
      </div>
    </div>
  );
}