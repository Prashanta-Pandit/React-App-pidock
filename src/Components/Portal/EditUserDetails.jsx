import React, { useState, useEffect } from 'react';
import { fireStoreCollectionReference, firebaseStorage } from '../FirebaseInitialisation';
import { onSnapshot, query, where, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js';
import UserDetails from './UserDetails';

export default function EditUserDetails() {
    const [signedInUserId, setSignedInUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [isCancelButtonClicked, setIsCancelButtonClicked] = useState(false);

    const [profilePicture, setProfilePicture] = useState('');
    const [profilePictureURL, setProfilePictureURL] = useState('');

    const [coverPicture, setCoverPicture] = useState(null);
    const [coverPictureURL, setCoverPictureURL] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdateButtonClicked, setIsUpdateButtonClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
                    setDepartment(details[0].department);
                    setRole(details[0].role);
                    setProfilePictureURL(details[0].profilePictureURL || 'no image');
                }
            });
            return () => unsubscribe();
        }
    }, [signedInUserId]);

    useEffect(() => {
        if (isUpdateButtonClicked) {
            const timer = setTimeout(() => {
                setIsUpdateButtonClicked(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isUpdateButtonClicked]);

    const formatInput = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const containsNumber = (str) => /\d/.test(str);

    function handleCancel(e) {
        e.preventDefault();
        setIsCancelButtonClicked(true);
    }

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage('');
    };

    function handleProfilePictureUpload(image) {
        const imageRef = ref(firebaseStorage, `profilePictures/${image.name}`);
        return uploadBytes(imageRef, image)
            .then(() => getDownloadURL(imageRef))
            .catch(error => {
                console.error('Error uploading image:', error);
                throw error;
            });
    }

    async function handleCoverPictureUpload(image){
        const imageRef = ref(firebaseStorage, `employeeCoverPictures/${image.name}`);
        try{
            await uploadBytes(imageRef, image);
            const downloadURL = await getDownloadURL(imageRef);
            return downloadURL;
        }catch{
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    async function handleOnSubmitEditUserDetails(e) {
        e.preventDefault();
        setIsUpdateButtonClicked(true);
    
        try {
            let newProfilePictureURL = profilePictureURL;
            // make sure that the both profile picture and cover picture run the code is they are not null. If no changes is done, the values are null. 
            if (profilePicture) {
                newProfilePictureURL = await handleProfilePictureUpload(profilePicture);
                setProfilePictureURL(newProfilePictureURL);
            }
    
            let newCoverPictureURL = coverPictureURL;
            if (coverPicture) {
                newCoverPictureURL = await handleCoverPictureUpload(coverPicture);
                setCoverPictureURL(newCoverPictureURL);
            }
    
            if (userDetails.length > 0) {
                const userDoc = doc(fireStoreCollectionReference, userDetails[0].id);
                const formattedFirstName = formatInput(firstName);
                const formattedLastName = formatInput(lastName);
                const formattedDepartment = department.toUpperCase();
                const formattedRole = formatInput(role);
    
                const userDataToUpdate = {
                    firstName: formattedFirstName,
                    lastName: formattedLastName,
                    department: formattedDepartment,
                    role: formattedRole,
                    profilePictureURL: newProfilePictureURL
                };
    
                if (coverPicture) {
                    userDataToUpdate.coverPictureURL = newCoverPictureURL;
                }
    
                if (containsNumber(firstName) || containsNumber(lastName) || containsNumber(department) || containsNumber(role)) {
                    setErrorMessage('Input field should not contain number.');
                } else {
                    await updateDoc(userDoc, userDataToUpdate);
                }
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        } finally {
            setIsUpdateButtonClicked(false);
        }
    }
    

    return (
        isCancelButtonClicked ? (
            <UserDetails />
        ) : (
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <form className="space-y-6" onSubmit={handleOnSubmitEditUserDetails}>
                    {errorMessage && (
                        <div className="text-red-500 text-sm">{errorMessage}</div>
                    )}
                    <div className="px-4 sm:px-0">
                        <h3 className="text-xl font-bold leading-7 text-gray-900">Update your details</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-100 space-y-4">
                        {/* First Name and Last Name fields */}
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col w-1/2">
                                <label className="text-sm font-bold leading-6 text-gray-900">First Name</label>
                                    <input
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={firstName}
                                        onChange={handleInputChange(setFirstName)}
                                        placeholder={userDetails.length > 0 ? `${userDetails[0].firstName}` : 'No data'}
                                    />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="text-sm font-bold leading-6 text-gray-900">Last Name</label>
                                    <input
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={lastName}
                                        onChange={handleInputChange(setLastName)}
                                        placeholder={userDetails.length > 0 ? `${userDetails[0].lastName}` : 'No data'}
                                    />
                            </div>
                        </div>
                        {/* Department and Role fields */}
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col w-1/2">
                                <label className="text-sm font-bold leading-6 text-gray-900">Department</label>
                                    <input
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={department}
                                        onChange={handleInputChange(setDepartment)}
                                        placeholder={userDetails.length > 0 ? `${userDetails[0].department}` : 'No data'}
                                    />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="text-sm font-bold leading-6 text-gray-900">Role</label>
                                    <input
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={role}
                                        onChange={handleInputChange(setRole)}
                                        placeholder={userDetails.length > 0 ? `${userDetails[0].role}` : 'No data'}
                                    />
                            </div>
                        </div>
                        {/* Email field */}
                        <div className="flex flex-col">
                            <label className="text-sm font-bold leading-6 text-gray-900">Email</label>
                            <div className='flex flex-row'>
                                <p>{userDetails.length > 0 ? `${userDetails[0].email}` : <span className='text-gray-500'>Loading...</span>}</p>
                            </div>
                        </div>
                        {/* Profile Picture and Cover Picture fields */}
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col w-1/2">
                                <label className="text-sm font-bold leading-6 text-gray-900">Profile Picture</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setProfilePicture(e.target.files[0]);
                                            }
                                        }}
                                    />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="text-sm font-bold leading-6 text-gray-900">Cover Picture</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setCoverPicture(e.target.files[0]);
                                            }
                                        }}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-black"
                        >
                            {isUpdateButtonClicked ? (
                                <span className="mr-2">Updating...</span>
                            ) : (
                                <>Update</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        )
    );
}





