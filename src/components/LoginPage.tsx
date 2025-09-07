import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Users, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (type: 'public' | 'police') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loginMode, setLoginMode] = useState<'public' | 'police'>('public');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    badgeNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginMode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* App Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Crime 360</h1>
          </div>
          <p className="text-gray-600">Comprehensive Crime Management System</p>
        </div>

        {/* Mode Selection */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLoginMode('public')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              loginMode === 'public'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Public</span>
          </button>
          <button
            onClick={() => setLoginMode('police')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              loginMode === 'police'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Police</span>
          </button>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {loginMode === 'public' ? 'Public Access' : 'Police Access'}
            </CardTitle>
            <CardDescription>
              {loginMode === 'public'
                ? 'Access crime statistics and safety information'
                : 'Secure access to law enforcement tools'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginMode === 'police' && (
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge Number</Label>
                  <Input
                    id="badge"
                    type="text"
                    placeholder="Enter your badge number"
                    value={formData.badgeNumber}
                    onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full">
                {loginMode === 'public' ? 'Access Public Dashboard' : 'Access Police Portal'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Demo credentials: any email/password combination </p>
          {loginMode === 'police' && <p>Any badge number accepted right now</p>}
        </div>
      </div>
    </div>
  );
}