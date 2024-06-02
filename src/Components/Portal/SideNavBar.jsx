import React, { useState } from 'react';
import { BarChart, UserRound, Settings } from 'lucide-react'; 
import SignoutButton from '../SignOut/SignoutButton';
import Profile from '../Portal/Profile';

export default function SidebarNav() {
    const [showProfile, setShowProfile] = useState(false);

    function handleProfileClick(){
      setShowProfile(true);
    }

    return (
      <>
        <aside className="flex h-screen w-64 flex-col overflow-y-auto border-r bg-white px-5 py-32 shadow-2xl">
            <div className="mt-6 flex flex-1 flex-col justify-between">
                <nav className="-mx-3 space-y-6 ">
                    <div className="space-y-3 ">
                        <a
                            className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                        >
                            <BarChart className="h-5 w-5" aria-hidden="true" />
                            <span className="mx-2 text-sm font-medium">My Dashboard</span>
                        </a>
                        <a
                            className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                            onClick={handleProfileClick}
                        >
                            <UserRound className="h-5 w-5" aria-hidden="true" />
                            <span className="mx-2 text-sm font-medium">My Profile</span>
                        </a>
                        <a
                            className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                        >
                            <Settings className="h-5 w-5" aria-hidden="true" />
                            <span className="mx-2 text-sm font-medium">Settings</span>
                        </a>
                    </div>
                    <div className="space-y-3 ">
                        <SignoutButton />
                    </div>
                </nav>
            </div>
        </aside>
        <div className='flex-1'>
           {showProfile && <Profile />}
        </div>
      </>
    );
}
