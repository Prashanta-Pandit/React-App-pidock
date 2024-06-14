import React, { useState, useEffect } from 'react';
import { Mail, User, Pencil, LoaderCircle, ArrowLeft, Ban, ImageUp, BriefcaseBusiness, Landmark } from 'lucide-react'; // Import the Loader icon from lucide-react
import { fireStoreCollectionReference, firebaseStorage } from '../FirebaseInitialisation';
import { onSnapshot, query, where, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js';
import UserDetails from './UserDetails';

export default function EditUserDetails() {
    // State variables to manage user details and UI state
    const [signedInUserId, setSignedInUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [isCancelButtonClicked, setIsCancelButtonClicked] = useState(false);
    const [firstNameInputClicked, setFirstNameInputClicked] = useState(false);
    const [lastNameInputClicked, setLastNameInputClicked] = useState(false);
    const [departmentInputClicked, setDepartmentInputClicked] = useState(false);
    const [roleInputClicked, setRoleInputClicked] = useState(false);

    const [imageInputClicked, setImageInputClicked] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [profilePictureURL, setProfilePictureURL] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdateButtonClicked, setIsUpdateButtonClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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

    // Format the user input to proper form
    const formatInput = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Regular expression to handle if the input consists of a number
    const containsNumber = (str) => /\d/.test(str);

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

    function handleDepartmentInputClicked() {
        setDepartmentInputClicked(true);
    }

    function handleRoleInputClicked() {
        setRoleInputClicked(true);
    }

    // Function to handle input changes and reset error message
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage(''); // Clear the error message
    };

    // Function to handle file upload for profile picture
    function handleImageUpload(image) {
        const imageRef = ref(firebaseStorage, `profilePictures/${image.name}`);
        return uploadBytes(imageRef, image)
            .then(() => getDownloadURL(imageRef))
            .catch(error => {
                console.error('Error uploading image:', error);
                throw error;
            });
    }

    // Function to handle form submission and update user details
    async function handleOnSubmitEditUserDetails(e) {
        e.preventDefault();
        setIsUpdateButtonClicked(true); // Indicate update in progress

        try {
            let newProfilePictureURL = profilePictureURL;
            if (profilePicture) {
                newProfilePictureURL = await handleImageUpload(profilePicture);
                setProfilePictureURL(newProfilePictureURL);
            }

            if (userDetails.length > 0) {
                const userDoc = doc(fireStoreCollectionReference, userDetails[0].id);
                const formattedFirstName = formatInput(firstName);
                const formattedLastName = formatInput(lastName);
                const formattedDepartment = formatInput(department);
                const formattedRole = formatInput(role);

                const userDataToUpdate = {
                    firstName: formattedFirstName,
                    lastName: formattedLastName,
                    department: formattedDepartment,
                    role: formattedRole,
                    profilePictureURL: newProfilePictureURL // Update the URL in Firestore
                };

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
            <UserDetails /> // Render UserDetails component if cancel button is clicked
        ) : (
            <div className="mt-16 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <form className="space-y-6" onSubmit={handleOnSubmitEditUserDetails}>
                    {errorMessage && (
                        <div className="text-red-500 text-sm">{errorMessage}</div>
                    )}
                    <div className="px-4 sm:px-0">
                        <h3 className="text-xl font-bold leading-7 text-gray-900">Update your details</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            {/* First Name field */}
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <User />
                                    <span className="ml-2">First Name</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {firstNameInputClicked ? (
                                        <input
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={firstName}
                                            onChange={handleInputChange(setFirstName)}
                                            placeholder={userDetails.length > 0 ? `${userDetails[0].firstName}` : 'No data'}
                                        />
                                    ) : (
                                        <div className='flex flex-row'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].firstName}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className=" ml-2 cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={handleFirstNameInputClicked} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* Last Name field */}
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <User />
                                    <span className="ml-2">Last Name</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {lastNameInputClicked ? (
                                        <input
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={lastName}
                                            onChange={handleInputChange(setLastName)}
                                            placeholder={userDetails.length > 0 ? `${userDetails[0].lastName}` : 'No data'}
                                        />
                                    ) : (
                                        <div className='flex flex-row'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].lastName}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className=" ml-2 cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={handleLastNameInputClicked} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* Department field */}
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <Landmark />
                                    <span className="ml-2">Department</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {departmentInputClicked ? (
                                        <input
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={department}
                                            onChange={handleInputChange(setDepartment)}
                                            placeholder={userDetails.length > 0 ? `${userDetails[0].department}` : 'No data'}
                                        />
                                    ) : (
                                        <div className='flex flex-row'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].department}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className=" ml-2 cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={handleDepartmentInputClicked} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* Role field */}
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <BriefcaseBusiness />
                                    <span className="ml-2">Role</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {roleInputClicked ? (
                                        <input
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={role}
                                            onChange={handleInputChange(setRole)}
                                            placeholder={userDetails.length > 0 ? `${userDetails[0].role}` : 'No data'}
                                        />
                                    ) : (
                                        <div className='flex flex-row'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].role}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className=" ml-2 cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={handleRoleInputClicked} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* Email field */}
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <Mail />
                                    <span className="ml-2">Email</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    <div className='flex flex-row'>
                                        <p>{userDetails.length > 0 ? `${userDetails[0].email}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                    </div>
                                </dd>
                            </div>
                            {/* Profile Picture field */}
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <ImageUp />
                                    <span className="ml-2">Profile Picture</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {imageInputClicked ? (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setProfilePicture(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className='flex flex-row'>
                                            <p>{profilePictureURL ? <img src={profilePictureURL} alt="Profile" className="h-10 w-10 rounded-full" /> : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className=" ml-2 cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={() => setImageInputClicked(true)} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-slate-300 focus:outline-none"
                            onClick={handleCancel}
                        >
                            <ArrowLeft className="mr-2 text-black" /> back
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-black"
                        >
                            {isUpdateButtonClicked ? (
                                <LoaderCircle className="mr-2 animate-spin" />
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



