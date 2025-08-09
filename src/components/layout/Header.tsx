import React from 'react';
import { CheckSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-2 rounded-lg shadow-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-sm text-gray-600">Organize your work, achieve your goals</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="bg-gradient-to-r from-violet-100 to-purple-100 p-2 rounded-full">
                <User className="w-4 h-4 text-violet-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-600">{currentUser?.email}</p>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;