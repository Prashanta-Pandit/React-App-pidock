import React, { useState, useEffect } from 'react';
import { Mail, User, Pencil, LoaderCircle } from 'lucide-react';
import { fireStoreCollectionReference } from '../FirebaseInitialisation';
import { onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

import EditUserDetails from './EditUserDetails';

export default function Profile() {
    const [signedInUserId, setSignedInUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [isEditButtonClicked, setIsEditButtonClicked] = useState(false); // the edit button is false by default.

    useEffect(() => {
        const userId = localStorage.getItem('signedInUserUid'); // this is user id that is stored after signing in from signin page.
        if (userId) {
            setSignedInUserId(userId);
        }
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        if (signedInUserId) {
            const q = query(fireStoreCollectionReference, where("userLoginId", "==", signedInUserId)); // q stores the query matching the Logged in User ID.
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const details = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); // get the details in array.
                setUserDetails(details); 
            });
            return () => unsubscribe(); // Clean up the subscription on unmount
        }
    }, [signedInUserId]); // Re-run this effect when signedInUserId changes

    function editButtonClick() {
        setIsEditButtonClicked(true);
    }

    return (
        <>
            {isEditButtonClicked ? (
                <EditUserDetails />
            ) : (
                <div className="mt-16 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div>
                        <div className=" flex flex-row justify-between px-4 sm:px-0 ">
                            <h3 className="text-2xl font-bold leading-7 text-gray-900">Your details</h3>
                            <button className="flex flex-row text-sm font-normal leading-6 text-blue-600" onClick={editButtonClick}>
                                    <Pencil className='size-5 hover:size-6'/>
                                    <p>edit</p>
                            </button>
                        </div>                             
                        <div className="mt-6 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                        <User />
                                        <span className="ml-2">Full Name</span>
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {userDetails.length > 0 ? `${userDetails[0].firstName} ${userDetails[0].lastName}` : <LoaderCircle className='text-gray-500 animate-spin' /> }
                                    </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                        <Mail />
                                        <span className="ml-2">Email address</span>
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {userDetails.length > 0 ? userDetails[0].email : <LoaderCircle className='text-gray-500 animate-spin' />}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

