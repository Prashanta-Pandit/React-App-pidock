import React, { useState, useEffect } from 'react';
import { Mail, User, Pencil, LoaderCircle } from 'lucide-react';
import { auth, fireStoreCollectionReference } from '../FirebaseInitialisation';
import { onSnapshot, query, where, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import UserDetails from './UserDetails';

export default function EditUserDetails() {
    const [signedInUserId, setSignedInUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [isCancelButtonClicked, setIsCancelButtonClicked] = useState(false);
    const [firstNameInputClicked, setFirstNameInputClicked] = useState(false);
    const [lastNameInputClicked, setLastNameInputClicked] = useState(false);
    const [emailInputClicked, setEmailInputClicked] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isUpdateButtonClicked, setIsUpdateButtonClicked] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordButtonClick, setConfirmPasswordButtonClick] = useState(false);

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

    const formatInput = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    function handleOnSubmitEditUserDetails(e) {
        e.preventDefault();
        setIsUpdateButtonClicked(true);
        setIsPasswordModalOpen(true);
    }

    function handlePasswordConfirmation() {

        setConfirmPasswordButtonClick(true);
        setPasswordError(''); // Reset password error before reauthentication
        if (userDetails.length > 0) {
            const userDoc = doc(fireStoreCollectionReference, userDetails[0].id);
            const formattedFirstName = formatInput(firstName);
            const formattedLastName = formatInput(lastName);
            const formattedEmail = email.toLowerCase();
            const userDataToUpdate = {
                firstName: formattedFirstName,
                lastName: formattedLastName,
                email: formattedEmail
            };

            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, password);

            reauthenticateWithCredential(user, credential)
                .then(() => {
                    console.log('Reauthentication successful');
                    return updateEmail(user, formattedEmail);
                })
                .then(() => {
                    console.log('Email update successful');
                    return updateDoc(userDoc, userDataToUpdate);
                })
                .then(() => {
                    console.log('Firestore update successful');
                    setIsPasswordModalOpen(false);
                    setTimeout(() => {
                        setIsUpdateButtonClicked(false);
                    }, 2000);
                })
                .catch((error) => {
                    console.error('Error updating user details:', error);
                    if (error.code === 'auth/wrong-password') {
                        setPasswordError('Incorrect password. Please try again.');
                    } else {
                        setPasswordError('Failed to update details. Please try again.');
                    }
                    setIsUpdateButtonClicked(false);
                });
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        setIsCancelButtonClicked(true);
    }

    return (
        isCancelButtonClicked ? (
            <UserDetails />
        ) : (
            <div className="mt-16 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <form className="space-y-6" onSubmit={handleOnSubmitEditUserDetails}>
                    <div className="px-4 sm:px-0">
                        <h3 className="text-2xl font-bold leading-7 text-gray-900">Update your details</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <User />
                                    <span className="ml-2">First Name</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
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
                                            <Pencil className="size-4 text-blue-500 hover:size-6" onClick={() => setFirstNameInputClicked(true)} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <User />
                                    <span className="ml-2">Last Name</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
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
                                            <Pencil className="size-4 text-blue-500 hover:size-6" onClick={() => setLastNameInputClicked(true)} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <Mail />
                                    <span className="ml-2">Email</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
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
                                            <Pencil className="size-4 text-blue-500 hover:size-6" onClick={() => setEmailInputClicked(true)} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <div className="sm:col-span-2"></div>
                                <dd className="flex flex-col sm:flex-row sm:space-x-4 justify-end text-sm font-normal leading-6">
                                    {isUpdateButtonClicked ? (
                                        <button
                                            className="flex items-center justify-center bg-green-900 text-white rounded-md px-4 py-2 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring- focus:ring-opacity-50 mb-2 sm:mb-0"
                                        >
                                            <LoaderCircle className="animate-spin mr-2" size={16} />
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

                {isPasswordModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="bg-white p-6 rounded-md shadow-md">
                            <h2 className="text-xl font-bold mb-4">Reauthenticate</h2>
                            <p className="mb-4">Please enter your password to confirm changes:</p>
                            <input
                                type="password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            {passwordError && (
                                <p className="text-red-500 text-sm mb-4">{passwordError}</p>
                            )}
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-green-900 text-white rounded-md px-4 py-2 hover:bg-green-700"
                                    onClick={handlePasswordConfirmation}
                                >
                                    {confirmPasswordButtonClick ? "Confirming..." : "Confirm"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    );
}

