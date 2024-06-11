import React, { useState, useEffect } from 'react';
import { Mail, User, Pencil, LoaderCircle, Ban, BriefcaseBusiness, Handshake, Landmark  } from 'lucide-react'; // Import the Loader icon from lucide-react
import { fireStoreCollectionReference } from '../FirebaseInitialisation';
import { onSnapshot, query, where, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import UserDetails from './UserDetails';

export default function EditUserDetails() {
    // State variables to manage user details and UI state
    const [signedInUserId, setSignedInUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [isCancelButtonClicked, setIsCancelButtonClicked] = useState(false);
    const [firstNameInputClicked, setFirstNameInputClicked] = useState(false);
    const [lastNameInputClicked, setLastNameInputClicked] = useState(false);
    const [titleInputClicked, setTitleInputClicked] = useState(false);
    const [departmentInputClicked, setDepartmentInputClicked] = useState(false);
    const [roleInputClicked, setRoleInputClicked] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [title, setTitle] = useState('');
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
                    setTitle(details[0].title);
                    setDepartment(details[0].department);
                    setRole(details[0].role);
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

    //format the user input to proper form
    const formatInput = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // regular expression to handle if the input consist number. 
    const containsNumber = (str) => /\d/.test(str);

    // Function to handle input changes and reset error message
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage(''); // Clear the error message
    };

    // Function to handle form submission and update user details
    function handleOnSubmitEditUserDetails(e) {
        e.preventDefault();
        setIsUpdateButtonClicked(true); // Indicate update in progress
        if (userDetails.length > 0) {

            // refernce the document that you want to update. 
            const userDoc = doc(fireStoreCollectionReference, userDetails[0].id); //const docRef = doc(db, "collectionName", "documentID");
            const formattedFirstName = formatInput(firstName);
            const formattedLastName = formatInput(lastName);
            const formattedTitle = formatInput(title);
            const formattedDepartment = formatInput(department);
            const formattedRole = formatInput(role);
            //const formattedEmail = email.toLowerCase(); // Typically, emails are stored in lower case

            const userDataToUpdate = {
                firstName: formattedFirstName,
                lastName: formattedLastName,
                department: formattedDepartment,
                title: formattedTitle,
                role: formattedRole
                //email: formattedEmail
            };

            if (containsNumber(firstName) || containsNumber(lastName) || containsNumber(title) || containsNumber(department) || containsNumber(role)) {
                setErrorMessage('Input field should not contain number.');
            }
            else {
                updateDoc(userDoc, userDataToUpdate) // data update in firbase firestore.
                    .then(() => {
                        // Indicate update success and show "Done" for 2 seconds
                        setTimeout(() => {
                            setIsUpdateButtonClicked(false);
                        }, 2000); // 2 sec
                    })
                    .catch((error) => {
                        // Handle errors and reset the update button state
                        console.error('Error updating user details:', error);
                        setIsUpdateButtonClicked(false);
                    });
            }
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

    function handleTitleInputClicked() {
        setTitleInputClicked(true);
    }

    function handleDepartmentInputClicked() {
        setDepartmentInputClicked(true);
    }

    function handleRoleInputClicked() {
        setRoleInputClicked(true);
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
                        <h3 className="text-2xl font-bold leading-7 text-gray-900">Update your details</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            {/* Title field */}
                            <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <Handshake />
                                    <span className="ml-2">Occupation Title</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {/* using conditional rendering */}
                                    {titleInputClicked ? (
                                        <input
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={title}
                                            onChange={handleInputChange(setTitle)}
                                            placeholder={userDetails.length > 0 ? `${userDetails[0].title}` : 'No data'}
                                        />
                                    ) : (
                                        <div className='flex flex-row justify-between'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].title}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className="cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={handleTitleInputClicked} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* First Name field */}
                            <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
                                            onChange={handleInputChange(setFirstName)}
                                            placeholder={userDetails.length > 0 ? `${userDetails[0].firstName}` : 'No data'}
                                        />
                                    ) : (
                                        <div className='flex flex-row justify-between'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].firstName}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className="cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={handleFirstNameInputClicked} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* Last Name field */}
                            <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
                                        <div className='flex flex-row justify-between'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].lastName}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className="cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={handleLastNameInputClicked} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* Email field */}
                            <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="flex flex-row text-sm font-bold leading-6 text-gray-900">
                                    <Mail />
                                    <span className="ml-2">Email</span>
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {userDetails.length > 0 ? `${userDetails[0].email}` : <LoaderCircle className='text-gray-500 animate-spin' />}
                                </dd>
                            </div>
                            {/* Department field */}
                            <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
                                        <div className='flex flex-row justify-between'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].department}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className="cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={handleDepartmentInputClicked} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            {/* Role field */}
                            <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
                                        <div className='flex flex-row justify-between'>
                                            <p>{userDetails.length > 0 ? `${userDetails[0].role}` : <LoaderCircle className='text-gray-500 animate-spin' />}</p>
                                            <Pencil className="cursor-pointer size-4 text-blue-500 hover:animate-bounce" onClick={handleRoleInputClicked} />
                                        </div>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    {/* Button for Cancel and Update */}
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            onClick={handleCancel}
                            className="flex flex-row rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 border border-gray-500 border-solid">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800"
                            disabled={isUpdateButtonClicked}
                        >
                            {isUpdateButtonClicked ? (
                                <div className='flex flex-row justify-center'>
                                    <LoaderCircle className='w-6 h-6 animate-spin' />
                                    <span className="ml-2">Updating...</span>
                                </div>
                            ) : (
                                <div>Update</div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        )
    );
}


