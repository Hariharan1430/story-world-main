import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react'; // Assuming you are using lucide-react for icons

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, handleSignOut } = useAuth();

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-250px)] bg-white h-16 border-b border-gray-200 z-20">
      <div className="flex items-center justify-between px-4 md:px-6 h-full">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
          <h1 className="text-3xl font-semibold text-gray-800">Story World</h1>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span>Welcome, {user.displayName}!</span>
              <button
                onClick={handleSignOut}
                className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Sign Out
              </button>
            </>
          ) : ''}
        </div>
      </div>
    </header>
  );
};

export default Header;