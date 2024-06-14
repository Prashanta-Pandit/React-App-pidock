import React, { useState, useEffect } from 'react';
import { Mail, User, Pencil, LoaderCircle, BriefcaseBusiness, Landmark } from 'lucide-react';
import { fireStoreCollectionReference } from '../FirebaseInitialisation';
import { onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

import EditUserDetails from './EditUserDetails';

export default function Profile() {
    const [signedInUserId, setSignedInUserId] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [userImage, setUserImage] = useState('');
    const [isEditButtonClicked, setIsEditButtonClicked] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('signedInUserUid');
        if (userId) {
            setSignedInUserId(userId);
        }
    }, []);

    useEffect(() => {
        if (signedInUserId) {
            const q = query(fireStoreCollectionReference, where("userLoginId", "==", signedInUserId));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const details = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                if (details.length > 0) {
                    setUserDetails(details[0]);
                    setUserImage(details[0].imageUrl);
                }
            });
            return () => unsubscribe();
        }
    }, [signedInUserId]);

    function editButtonClick() {
        setIsEditButtonClicked(true);
    }

    // Function to handle file upload for profile picture
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // You can implement your upload logic here, such as using Firebase Storage
            // For simplicity, let's assume we update state with a local URL
            const imageUrl = URL.createObjectURL(file);
            setUserImage(imageUrl);
        }
    }

    return (
        <>
            {isEditButtonClicked ? (
                <EditUserDetails />
            ) : (
                <div className="mt-16 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-2/3">
                            <div className="flex flex-row justify-between px-4 sm:px-0">
                                <h3 className="text-xl font-bold leading-7 text-gray-900">Your details</h3>
                                <button className="flex flex-row text-sm font-normal leading-6 text-blue-600 hover:underline" onClick={editButtonClick}>
                                    <Pencil className="size-5 mr-1" />
                                    <span>edit</span>
                                </button>
                            </div>                             
                            <div className="mt-6 border-t border-gray-100">
                                <dl className="divide-y divide-gray-100">
                                    {userDetails ? (
                                        <>
                                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                                    <User />
                                                    <span className="ml-2">Full Name</span>
                                                </dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{`${userDetails.firstName} ${userDetails.lastName}`}</dd>
                                            </div>
                                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                                    <Mail />
                                                    <span className="ml-2">Email address</span>
                                                </dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userDetails.email}</dd>
                                            </div>
                                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                                    <Landmark />
                                                    <span className="ml-2">Department</span>
                                                </dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userDetails.department}</dd>
                                            </div>
                                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                                    <BriefcaseBusiness />
                                                    <span className="ml-2">Role</span>
                                                </dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userDetails.role}</dd>
                                            </div>
                                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                                    <BriefcaseBusiness />
                                                    <span className="ml-2">Profile Picture</span>
                                                </dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                    <label htmlFor="profilePicUpload" className="block px-4 py-1 text-sm text-black bg-gray-200 rounded-md cursor-pointer hover:bg-gray-100">
                                                        Upload Picture
                                                    </label>
                                                    <input
                                                        id="profilePicUpload"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                </dd>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-center py-5">
                                            <LoaderCircle className="text-gray-500 animate-spin" />
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}




