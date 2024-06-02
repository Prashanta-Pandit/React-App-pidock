import React, { useState } from 'react';
import { BarChart, UserRound, Settings } from 'lucide-react'; 
import SignoutButton from '../SignOut/SignoutButton';
import Profile from './Profile';
import UserSettings from './Settings';
import UserDashboard from './UserDashboard';

export default function SidebarNav() {
    const [showProfile, setShowProfile] = useState(false);
    const [showUserSettings, setUserShowSettings] = useState(false);
    const [showUserDashboard, setShowUserDashboard] = useState(false);
    const [activeButton, setActiveButton] = useState(null);

// function to handle Profile Click, and make sure that the User Dashboard and settings gets disappear and profile appear. 
    function handleProfileClick(){
      setShowProfile(true);
      setUserShowSettings(false);
      setShowUserDashboard(false);
      setActiveButton('profile');
    }

    function handleDashboardClick(){
      setShowProfile(false);
      setUserShowSettings(false);
      setShowUserDashboard(true);
      setActiveButton('dashboard');
    }

    function handleSettingsClick(){
      setShowProfile(false);
      setUserShowSettings(true);
      setShowUserDashboard(false);
      setActiveButton('settings');
    }
    
    return (
      <>
        <div className="mt-24 flex flex-row">
          {/** Left Fixed Container */}
          <div className="fixed flex h-screen w-64 flex-col border-r border-gray-500 border-t-0 px-5 py-10">
            <div className="mt-6 flex flex-1 flex-col justify-between">
              <nav className="-mx-3 space-y-6 ">
                <div className="space-y-3 ">
                  <a className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-200 hover:text-black ${activeButton === 'dashboard' ? 'bg-gray-200' : ''}`} onClick={handleDashboardClick}>
                    <BarChart className="h-5 w-5" aria-hidden="true" />
                    <span className="mx-2 text-sm font-medium">My Dashboard</span>
                  </a>
                  <a className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-200 hover:text-black ${activeButton === 'profile' ? 'bg-gray-200' : ''}`} onClick={handleProfileClick}>
                    <UserRound className="h-5 w-5" aria-hidden="true" />
                    <span className="mx-2 text-sm font-medium">My Profile</span>
                  </a>
                  <a className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-200 hover:text-black ${activeButton === 'settings' ? 'bg-gray-200' : ''}`} onClick={handleSettingsClick}>
                    <Settings className="h-5 w-5" aria-hidden="true" />
                    <span className="mx-2 text-sm font-medium">Settings</span>
                  </a>
                </div>
                <div className="space-y-3 ">
                  <SignoutButton />
                </div>
              </nav>
            </div>
          </div>

          {/** Right Container with details*/}
          <div className="ml-64 flex-1 flex flex-row">
            {showProfile && <Profile />}
            {showUserDashboard && <UserDashboard />}
            {showUserSettings && <UserSettings />}
          </div>
        </div>
      </>
    );
}
