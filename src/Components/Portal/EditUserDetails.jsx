import React, { useState, useEffect } from 'react';
import { Mail, User, Pencil, Loader } from 'lucide-react'; // Import the Loader icon from lucide-react
import { auth, fireStoreCollectionReference } from '../FirebaseInitialisation';
import { onSnapshot, query, where, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { updateEmail } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import UserDetails from './UserDetails';

export default function EditUserDetails() {
    // State variables to manage user details and UI state
    const [signedInUserId, setSignedInUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [isCancelButtonClicked, setIsCancelButtonClicked] = useState(false);
    const [firstNameInputClicked, setFirstNameInputClicked] = useState(false);
    const [lastNameInputClicked, setLastNameInputClicked] = useState(false);
    const [emailInputClicked, setEmailInputClicked] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdateButtonClicked, setIsUpdateButtonClicked] = useState(false);

    // Effect to retrieve signed-in user ID from local storage
    useEffect(() => {
        const userId = localStorage.getItem('signedInUserUid');
        if (userId) {
            setSignedInUserId(userId);
        }
    }, []);

    // Effect to fetch user details from Firestore when signed-in user ID is set
    useEffect(() => {
        if (signedInUserId) {
            const q = query(fireStoreCollectionReference, where("userLoginId", "==", signedInUserId));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const details = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setUserDetails(details);
                if (details.length > 0) {
                    setFirstName(details[0].firstName);
                    setLastName(details[0].lastName);
                    setEmail(details[0].email);
                }
            });
            return () => unsubscribe();
        }
    }, [signedInUserId]);

    // Function to handle form submission and update user details
    function handleOnSubmitEditUserDetails(e) {
        e.preventDefault();
        setIsUpdateButtonClicked(true); // Indicate update in progress
        if (userDetails.length > 0) {
            const userDoc = doc(fireStoreCollectionReference, userDetails[0].id);
            updateDoc(userDoc, {
                firstName,
                lastName,
                email
            })
            .then(() => {
                // After updating Firestore, update the Firebase Auth email
                return updateEmail(auth.currentUser, email);
            })
            .then(() => {
                // Indicate update success and show "Done" for 2 seconds
                setTimeout(() => {
                    setIsUpdateButtonClicked(false);
                }, 2000);
            })
            .catch((error) => {
                // Handle errors and reset the update button state
                console.error('Error updating user details:', error);
                setIsUpdateButtonClicked(false);
            });
        }
    }

    // Function to handle cancel button click
    function handleCancel(e) {
        e.preventDefault();
        setIsCancelButtonClicked(true); // Navigate back to UserDetails component
    }

    // Handlers to manage input field clicks
    function handleFirstNameInputClicked() {
        setFirstNameInputClicked(true);
    }

    function handleLastNameInputClicked() {
        setLastNameInputClicked(true);
    }

    function handleEmailInputClicked() {
        setEmailInputClicked(true);
    }

    return (
        isCancelButtonClicked ? (
            <UserDetails /> // Render UserDetails component if cancel button is clicked
        ) : (
            <div className="mt-16 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <form className="space-y-6" onSubmit={handleOnSubmitEditUserDetails}>
                    <div className="px-4 sm:px-0">
                        <h3 className="text-base font-bold leading-7 text-gray-900">Update your details</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            {/* First Name field */}
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <User />
                                    <span className="ml-2">First Name</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {/* using conditional rendering */}
                                    {firstNameInputClicked ? (
                                        <input
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder={userDetails.length > 0 ? `${userDetails[0].firstName}` : "loading..."}
                                        />
                                    ) : (
                                        <div className='flex flex-row p-3 justify-between'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].firstName}` : "loading..."}</p>
                                            <Pencil className="size-4 text-blue-500 hover:size-6" onClick={handleFirstNameInputClicked}/>
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* Last Name field */}
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <User />
                                    <span className="ml-2">Last Name</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {/* using conditional rendering */}
                                    {lastNameInputClicked ? (
                                        <input
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder={userDetails.length > 0 ? `${userDetails[0].lastName}` : "loading..."}
                                        />
                                    ) : (
                                        <div className='flex flex-row p-3 justify-between'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].lastName}` : "loading..."}</p>
                                            <Pencil className="size-4 text-blue-500 hover:size-6" onClick={handleLastNameInputClicked}/>
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* Email field */}
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <Mail />
                                    <span className="ml-2">Email</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {/* using conditional rendering */}
                                    {emailInputClicked ? (
                                        <input
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={userDetails.length > 0 ? `${userDetails[0].email}` : "loading..."}
                                        />
                                    ) : (
                                        <div className='flex flex-row p-3 justify-between'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].email}` : "loading..."}</p>
                                            <Pencil className="size-4 text-blue-500 hover:size-6" onClick={handleEmailInputClicked}/>
                                        </div>
                                    )}
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <div className="sm:col-span-2"></div>
                                <dd className="flex flex-col sm:flex-row sm:space-x-4 justify-end text-sm font-normal leading-6">
                                    {/* Update button with loader */}
                                    {isUpdateButtonClicked ? (
                                        <button
                                            className="flex items-center justify-center bg-green-900 text-white rounded-md px-4 py-2 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring- focus:ring-opacity-50 mb-2 sm:mb-0"
                                        >
                                            <Loader className="animate-spin mr-2" size={16} /> {/* Spinning loader */}
                                            Updating...
                                        </button>
                                    ) : (
                                        <button
                                            className="flex items-center justify-center bg-black text-white rounded-md px-4 py-2 hover:bg-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring- focus:ring-opacity-50 mb-2 sm:mb-0"
                                            type="submit"
                                        >
                                            Update
                                        </button>
                                    )}
                                    {/* Cancel button */}
                                    <button
                                        className="flex items-center justify-center bg-white text-gray-900 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                        onClick={handleCancel}
                                    >
                                        Back
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
