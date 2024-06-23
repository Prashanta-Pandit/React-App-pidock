import React, { useState, useEffect } from 'react';
import { LoaderCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { fireStoreCollectionReference } from '../FirebaseInitialisation';
import { onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

export default function Profile() {
    const [signedInUserId, setSignedInUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [expandedSection, setExpandedSection] = useState(null); // State to manage expanded section

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

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <>  
            <div className="mt-16 flex min-h-full flex-col justify-center py-12 px-4 lg:px-8">
                {userDetails.length > 0 ? (
                    <>
                        {/* Profile section */}
                        <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="relative h-48 bg-gray-300">
                                <img className="absolute inset-0 object-cover w-full h-full" src={userDetails[0].coverPictureURL} alt="Background" />
                            </div>
                            <div className="relative flex justify-center lg:justify-start lg:ml-10 -mt-12">
                                <img className="h-36 w-36 rounded-full border-4 border-white shadow-lg" src={userDetails[0].profilePictureURL} alt="Profile Picture" />
                            </div>
                            <div className="text-center lg:text-left px-6 py-4">
                                <h2 className="text-2xl font-semibold text-gray-800">{`${userDetails[0].firstName} ${userDetails[0].lastName}`}</h2>
                                <p className="text-gray-600">{userDetails[0].email}</p>
                                <p className="text-gray-600">{`${userDetails[0].department} (${userDetails[0].role})`}</p>
                                <div className="mt-4 flex justify-end">
                                    <button className="bg-black text-white text-sm font-medium p-2 rounded-md">Update</button>
                                    <button className="bg-gray-200 text-gray-700 text-sm font-medium p-2 rounded-md ml-2">More...</button>
                                </div>
                            </div>
                        </div>
                        {/* Document section */}
                        <section>
                                    <div 
                                        className="cursor-pointer rounded-md border-gray-400 shadow-lg transition-all duration-200"
                                        onClick={() => toggleSection('documents')}
                                    >
                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-between px-4 py-5 sm:p-6"
                                        >
                                            <span className="flex text-lg font-semibold text-black">Documents</span>
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
                                        className="cursor-pointer rounded-md border-gray-400 shadow-lg transition-all duration-200"
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
        </>
    );
}

