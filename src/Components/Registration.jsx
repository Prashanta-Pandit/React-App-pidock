import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, fireStoreCollectionReference } from './FirebaseInitialisation';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { addDoc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { LoaderCircle } from 'lucide-react';

import Footer from "./Footer";

export default function Registration() {
    const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const redirectToLoginPage = () => {
        navigate('/');
    };

    const redirectToDashboardPage = () => {
        navigate('/portal/dashboard');
    };

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('');
    const [emailRegistration, setEmailRegistration] = useState('');
    const [passwordRegistration, setPasswordRegistration] = useState('');
    const [verifyPasswordRegistration, setVerifyPasswordRegistration] = useState('');

    const formatInput = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    useEffect(() => {
        let timer;
        if (isCreateButtonClicked) {
            timer = setTimeout(() => {
                setIsCreateButtonClicked(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [isCreateButtonClicked]);

    // Regular expression to check if the input contains a number.
    const containsNumber = (str) => /\d/.test(str);

    // Handler for input changes to clear error messages
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage('');
    };

    const handleCreateAccountOnSubmit = (e) => {
        e.preventDefault();
        setIsCreateButtonClicked(true);

        if (containsNumber(firstName) || containsNumber(lastName) || containsNumber(title) || containsNumber(department) || containsNumber(role)) {
            setErrorMessage('Input field should not contain number.');
        } else {
            if (passwordRegistration === verifyPasswordRegistration) {
                const formattedFirstName = formatInput(firstName);
                const formattedLastName = formatInput(lastName);
                const formattedTitle = formatInput(title);
                const formattedDepartment = formatInput(department);
                const formattedRole = formatInput(role);
                const formattedEmail = emailRegistration.toLowerCase();

                createUserWithEmailAndPassword(auth, formattedEmail, passwordRegistration)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        const userLoginId = user.uid;

                        return addDoc(fireStoreCollectionReference, {
                            userLoginId: userLoginId,
                            firstName: formattedFirstName,
                            lastName: formattedLastName,
                            email: formattedEmail,
                            department : formattedDepartment,
                            title : formattedTitle,
                            role: formattedRole
                        });
                    })
                    .then(() => {
                        redirectToDashboardPage();
                    })
                    .catch((error) => {
                        var errorMessage = error.message;
                        var errorCode = error.code;
                        console.error("Sign up error:", errorCode);
                        console.error("Sign up error:", errorMessage);
                        if (errorCode == 'auth/weak-password') {
                            alert('Password should be at least 6 characters');
                        }
                        else{
                            alert('Email address is already in use. Please use a different email to get started.');
                        }
                    });
            } else {
                alert('Passwords do not match.');
            }
        }
    };

    return (
        <>
        <div className="mt-20 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleCreateAccountOnSubmit}>
                    {errorMessage && (
                        <div className="text-red-500 text-sm">{errorMessage}</div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">First name</label>
                            <input id="first_name" name="first_name" type="text" required value={firstName} onChange={handleInputChange(setFirstName)} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                            <input id="last_name" name="last_name" type="text" required value={lastName} onChange={handleInputChange(setLastName)} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">Department</label>
                            <input id="department" name="department" type="text" required value={department} onChange={handleInputChange(setDepartment)} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">Role</label>
                            <input id="role" name="role" type="text" required value={role} onChange={handleInputChange(setRole)} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                        <input id="email" name="email" type="email" required value={emailRegistration} onChange={handleInputChange(setEmailRegistration)} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <input id="password" name="password" type="password" required value={passwordRegistration} onChange={handleInputChange(setPasswordRegistration)} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                        </div>
                        <div>
                            <label htmlFor="verify_password" className="block text-sm font-medium leading-6 text-gray-900">Verify Password</label>
                            <input id="verify_password" name="verify_password" type="password" required value={verifyPasswordRegistration} onChange={handleInputChange(setVerifyPasswordRegistration)} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:ring-black">
                            {isCreateButtonClicked ? (
                                <div className="flex items-center space-x-2">
                                    <LoaderCircle className="animate-spin" />
                                    <span>Creating your account...</span>
                                </div>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </div>
                </form>
                <button className="font-light text-black hover:text-slate-700 focus:outline-none mt-4" onClick={redirectToLoginPage}>
                    I have an account
                </button>
            </div>
        </div>
        <Footer />
        </>
    );
}


  

