import React, { useState, useEffect } from 'react';
import { Mail, User } from 'lucide-react';
import { fireStoreCollectionReference } from '../FirebaseInitialisation';
import { onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import UserDetails from './UserDetails';

export default function EditUserDetails() {
    const [signedInUserId, setSignedInUserId] = useState('');
    const [isCancelButtonClicked, setIsCancelButtonClicked] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('signedInUserUid'); // this is user id that is stored after signing in from signin page.
        if (userId) {
            setSignedInUserId(userId);
        }
    }, []); // Empty dependency array means this runs once on mount
    
    function handleEditUserDetails(e) {
        e.preventDefault(); // stop the page reload when clicked
        
    }

    function handleCancel(e) {
        e.preventDefault(); // Handle cancel action
        setIsCancelButtonClicked(true);
    }

    return (
        isCancelButtonClicked ? (
            <UserDetails />
        ) : (
            <div className="mt-16 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <form className="space-y-6" onSubmit={handleEditUserDetails}>
                    <div className="px-4 sm:px-0">
                        <h3 className="text-base font-bold leading-7 text-gray-900">Update your details</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <User />
                                    <span className="ml-2">Full Name</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    <input 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <Mail />
                                    <span className="ml-2">Email address</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    <input 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <div className="sm:col-span-2"></div> 
                                <dd className="flex flex-col sm:flex-row sm:space-x-4 justify-end text-sm font-normal leading-6">
                                    <button 
                                        className="flex items-center justify-center bg-black text-white rounded-md px-4 py-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring- focus:ring-opacity-50 mb-2 sm:mb-0"
                                        type="submit"
                                    >
                                        Update
                                    </button>
                                    <button 
                                        className="flex items-center justify-center bg-white text-gray-900 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </form>
            </div>
        )
    );
}

