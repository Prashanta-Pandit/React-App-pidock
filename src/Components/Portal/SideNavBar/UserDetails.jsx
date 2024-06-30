import React, { useState, useEffect } from 'react';
import { LoaderCircle, ChevronUp, ChevronDown, X } from 'lucide-react';
import {auth, fireStoreCollectionReference } from '../../FirebaseInitialisation';
import { onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import EditUserDetails from '../ProfileIcon/EditUserDetails';
import { onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

export default function Profile() {
    const [signedInUserId, setSignedInUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [expandedSection, setExpandedSection] = useState(null);
    const [isUpdateButtonClicked, setIsUpdateButtonClicked] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);

    useEffect(()=>{
        //setting the user ID for user who logged in.
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setSignedInUserId(user.uid);
            } 
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (signedInUserId) {
            const q = query(fireStoreCollectionReference, where("userLoginId", "==", signedInUserId));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const details = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setUserDetails(details);
            });
            return () => unsubscribe();
        }
    }, [signedInUserId]);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleUpdateButtonClick = () => {
        setIsModelOpen(true);
        setIsUpdateButtonClicked(true);
    };

    const handleCloseModal = () => {
        setIsModelOpen(false);
    };

    return (
        <>
            <div className="mt-16 flex  min-h-full flex-col justify-center py-12 px-4 lg:px-8">
                {userDetails.length > 0 ? (
                    <>
                        <div className="w-full border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="relative h-48 bg-gray-300">
                                <img className="absolute inset-0 object-cover w-full h-full" src={userDetails[0].coverPictureURL} alt="Background" />
                            </div>
                            <div className="relative flex justify-center lg:justify-start lg:ml-10 -mt-12">
                                <img className="h-36 w-36 rounded-full border-4 border-white shadow-lg" src={userDetails[0].profilePictureURL} alt="Profile Picture" />
                            </div>
                            <div className='flex flex-col items-center md:flex-row md:items-start md:justify-between'>
                                <div className="text-center lg:text-left px-6 py-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">{`${userDetails[0].firstName} ${userDetails[0].lastName}`}</h2>
                                    <p className="text-gray-600">{userDetails[0].email}</p>
                                    <p className="text-gray-600">{`${userDetails[0].department} (${userDetails[0].role})`}</p>
                                </div>
                                <div className="mt-4 flex justify-end p-7">
                                    <button className="bg-black text-white text-sm font-medium p-2 rounded-md" onClick={handleUpdateButtonClick}>Update</button>
                                    <button className="bg-gray-200 text-gray-700 text-sm font-medium p-2 rounded-md ml-2">More...</button>
                                </div>
                            </div>
                        </div>
                        <section className="mt-4 space-y-4">
                            <div
                                className="cursor-pointer border border-gray-300 hover:border-gray-500 rounded-md shadow-lg transition-all duration-200"
                                onClick={() => toggleSection('documents')}
                            >
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between px-4 py-5 sm:p-6"
                                >
                                    <span className="flex text-lg font-semibold text-black">Documents</span>
                                    {/* toggle Up or down when clicked. */}
                                    {expandedSection === 'documents' ? 
                                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                    }
                                </button>
                                {expandedSection === 'documents' && (
                                    <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                                        <p className="text-gray-500">
                                            Please find your Documents.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div
                                className="cursor-pointer border border-gray-300 hover:border-gray-500 rounded-md shadow-lg transition-all duration-200"
                                onClick={() => toggleSection('contactDetails')}
                            >
                                <button
                                    type="button"
                                    className="flex w-full items-start justify-between px-4 py-5 sm:p-6 md:items-center"
                                >
                                    <span className="flex text-start text-lg font-semibold text-black">
                                        Contact details
                                    </span>
                                    {expandedSection === 'contactDetails' ? 
                                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                    }
                                </button>
                                {expandedSection === 'contactDetails' && (
                                    <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                                        <p className="text-gray-500">
                                           Please find your contact details.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="flex justify-center py-5">
                        <LoaderCircle className="text-gray-500 animate-spin" />
                    </div>
                )}
            </div>

            {isModelOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-3 rounded-md shadow-md max-w-3xl overflow-y-auto" style={{ maxHeight: '80vh' }}>
                        <div className="flex justify-end">
                            <X className="cursor-pointer hover:bg-red-600 hover:text-white" onClick={handleCloseModal} />
                        </div>
                        {isUpdateButtonClicked && <EditUserDetails />}
                    </div>
                </div>
            )}
        </>
    );
}



