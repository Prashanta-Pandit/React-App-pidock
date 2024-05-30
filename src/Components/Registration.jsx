import React, { useState } from 'react'; // useState and useEffect hooks.
import { useNavigate } from 'react-router-dom'; // this helps to navigate to the other pages. 
import { auth, fireStoreCollectionReference } from './FirebaseInitialisation';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { addDoc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

//favicon icons and fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function Registration() {
    const navigate = useNavigate();

    function redirectToLoginPage() {
        navigate('/'); // '/' from the App.jsx
    }

    function redirectToPortalPage() {
        navigate('/portal'); // '/' from the App.jsx
    }

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailRegistration, setEmailRegistration] = useState('');
    const [passwordRegistration, setPasswordRegistration] = useState('');
    const [verify_PasswordRegistration, setVerify_PasswordRegistration] = useState('');

    function handleCreateAccountOnSubmit(e) {
        e.preventDefault();
        
        // check if the user input password matches. 
        if (passwordRegistration === verify_PasswordRegistration) {
            createUserWithEmailAndPassword(auth, emailRegistration, passwordRegistration)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const userLoginId = user.uid;

                    return addDoc(fireStoreCollectionReference, {
                        userLogiId: userLoginId,
                        firstName: firstName,
                        lastName: lastName,
                        email: emailRegistration
                    });
                })
                .then(() => {
                    redirectToPortalPage();
                })
                .catch((error) => {
                    var errorMessage = error.message;
                    console.error("Sign up error:", errorMessage);
                    if (errorMessage) {
                        alert('Email address is already in use. Please use a different email to get started.');
                    }
                });
        } else {
            alert('Passwords do not match.');
        }
    }

        // Function to handle signing in with Google
        function handleSignInWithGoogle() {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log('User logged in with Google:', user);
                
                //***** NOTE: we need to make sure that the data doesnot save double in firbase.  */
                // Retrieve additional user information from user
                const { displayName, email, uid } = user;
                const [firstName, lastName] = displayName.split(" ");

                // Add user information to Firestore
                return addDoc(fireStoreCollectionReference, {
                      userLoginId: uid, // Use UID as a unique identifier
                      firstName: firstName,
                      lastName: lastName,
                      email: email
                })
            })
            .then(() => {
                redirectToPortalPage(user); // Redirect the user or perform other actions
            })
            .catch((error) => {
                console.error('Google sign-in error:', error);
            });
        }

    return (
        <>
            <div className="mt-24 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleCreateAccountOnSubmit}>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium leading-6 text-gray-900">First name</label>
                            </div>
                            <div className="mt-2">
                                <input id="first_name" name="first_name" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                            </div>
                            <div className="mt-2">
                                <input id="last_name" name="last_name" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                            </div>
                            <div className="mt-2">
                                <input id="email" name="email" type="email" required value={emailRegistration} onChange={(e) => setEmailRegistration(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" required value={passwordRegistration} onChange={(e) => setPasswordRegistration(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Verify Password</label>
                            </div>
                            <div className="mt-2">
                                <input id="verify_password" name="verify_password" type="password" required value={verify_PasswordRegistration} onChange={(e) => setVerify_PasswordRegistration(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create account</button>
                        </div>
                    </form>
                    <button className="font-light text-black hover:text-slate-700 focus:outline-none mt-4" onClick={redirectToLoginPage}>
                        I have an account
                    </button>
                </div>
                <div className="flex items-center sm:mx-auto sm:w-full sm:max-w-sm my-3">
                        <hr className="flex-grow border-t border-gray-600"></hr>
                        <span className="mx-2 text-center text-sm font-light text-gray-600">or</span>
                        <hr className="flex-grow border-t border-gray-600"></hr>
                    </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <button 
                        className="mt-4 flex items-center w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSignInWithGoogle}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                        Continue with Google
                    </button>
                </div>
            </div>
        </>
    )
}
