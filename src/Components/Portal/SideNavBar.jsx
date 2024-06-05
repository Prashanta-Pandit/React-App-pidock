import React, { useState } from 'react';
import { BarChart, UserRound, Settings, Menu } from 'lucide-react'; 
import UserDetails from './UserDetails';
import UserSettings from './Settings';
import UserDashboard from './UserDashboard';


export default function SidebarNav() {
    const [showProfile, setShowProfile] = useState(false);
    const [showUserSettings, setUserShowSettings] = useState(false);
    // by default 
    const [showUserDashboard, setShowUserDashboard] = useState(true);
    const [activeButton, setActiveButton] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function handleProfileClick() {
        setShowProfile(true);
        setUserShowSettings(false);
        setShowUserDashboard(false);
        setActiveButton('profile');
        setIsSidebarOpen(false); // Close sidebar on mobile view
    }

    function handleDashboardClick() {
        setShowProfile(false);
        setUserShowSettings(false);
        setShowUserDashboard(true);
        setActiveButton('dashboard');
        setIsSidebarOpen(false); // Close sidebar on mobile view
    }

    function handleSettingsClick() {
        setShowProfile(false);
        setUserShowSettings(true);
        setShowUserDashboard(false);
        setActiveButton('settings');
        setIsSidebarOpen(false); // Close sidebar on mobile view
    }

    return (
        <>
            <div className=" flex left-0 z-30 w-full text-black h-full">
                {/* Mobile menu button */}
                <button 
                    className="lg:hidden px-6 fixed mt-36" 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <div className=' flex flex-1 flex-col justify-between '>
                        <nav className="-mx-3 space-y-6 ">
                            <div className="space-y-3 ">
                                <Menu className='hover:bg-slate-200'/>
                            </div>
                        </nav>
                    </div>
                </button>

                {/* Left Fixed Container */}
                <div className={` flex flex-1 flex-col justify-between fixed mt-24 inset-y-0 left-0 z-30 w-48 transform lg:transform-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-slate-800 text-white h-full px-5 py-10`}>
                        <nav className="-mx-3 space-y-6">
                            <div className="space-y-3">
                                <a className={`flex items-center rounded-lg px-4 py-2 text-white transition-colors duration-300 hover:text-black hover:bg-gray-200 ${activeButton === 'dashboard' ? 'bg-gray-700' : ''}`} onClick={handleDashboardClick}>
                                    <BarChart className="h-5 w-5" aria-hidden="true" />
                                    <span className="mx-2 text-sm font-medium">My Dashboard</span>
                                </a>
                                <a className={`flex items-center rounded-lg px-4 py-2 text-white transition-colors duration-300 hover:text-black hover:bg-gray-200 ${activeButton === 'profile' ? 'bg-gray-700' : ''}`} onClick={handleProfileClick}>
                                    <UserRound className="h-5 w-5" aria-hidden="true" />
                                    <span className="mx-2 text-sm font-medium">My Profile</span>
                                </a>
                                <a className={`flex items-center rounded-lg px-4 py-2 text-white transition-colors duration-300 hover:text-black hover:bg-gray-200 ${activeButton === 'settings' ? 'bg-gray-700' : ''}`} onClick={handleSettingsClick}>
                                    <Settings className="h-5 w-5" aria-hidden="true" />
                                    <span className="mx-2 text-sm font-medium">Settings</span>
                                </a>
                            </div>
                        </nav>
                    </div>

                {/* Right Container with details*/}
                <div className="flex-1 flex flex-col ml-4 lg:ml-64">
                    {showProfile && <UserDetails />}
                    {showUserDashboard && <UserDashboard />}
                    {showUserSettings && <UserSettings />}
                </div>
            </div>
        </>
    );
}

