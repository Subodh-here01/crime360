import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { PublicDashboard } from './components/PublicDashboard';
import { PoliceDashboard } from './components/PoliceDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'public' | 'police'>('login');
  const [userType, setUserType] = useState<'public' | 'police' | null>(null);

  const handleLogin = (type: 'public' | 'police') => {
    setUserType(type);
    setCurrentView(type);
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}
      {currentView === 'public' && (
        <PublicDashboard onLogout={handleLogout} />
      )}
      {currentView === 'police' && (
        <PoliceDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}