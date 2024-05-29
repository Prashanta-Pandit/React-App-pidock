import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth } from './FirebaseInitialisation';
import { signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

//favicon icons and fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function SignIn() {
    const navigate = useNavigate(); 

    function handleCreateAccount() {
        navigate('./register');
    }
    
    function handleForgotPassword(event) {
        event.preventDefault(); 
        navigate('./forgotPassword');
    }

    function redirectToPortal(signedInUser) {
        // storing the signed in user unique uid in local storgae. This helps in locating a seperate portal for signed user. 
        //This is a unique which has been stored in firestore as well, it will help to retrive other data from firebase.
        localStorage.setItem('signedInUserUid', signedInUser.uid)
        navigate('/portal');
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            redirectToPortal(user);
        } else {
            console.log('No user is signed in.');
        }
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSignInOnSubmit(e) {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                redirectToPortal(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Login error:', errorCode, errorMessage);
                if (errorCode === 'auth/invalid-credential') {
                    alert('Invalid email or password.');
                }
            });
    }
    
    //handle sign in with google 
    function handleGoogleSignIn() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                redirectToPortal(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Google sign-in error:', errorCode, errorMessage);
            });
    }

    return (
        <>
            <div className="mt-10 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSignInOnSubmit}>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                            </div>
                            <div className="mt-2">
                                <input id="email" name="email" type="email" autoComplete="current-email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <button 
                                    className="font-light text-black hover:text-slate-700 focus:outline-none mt-4" 
                                    onClick={handleForgotPassword}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                        </div>
                    </form>

                    <button 
                        className="font-light text-black hover:text-slate-700 focus:outline-none mt-4" 
                        onClick={handleCreateAccount}
                    >
                        No account? Create
                    </button>

                    <div className="sm:mx-auto sm:w-full sm:max-w-sm my-3">
                         <a className="text-center text-sm font-light text-gray-600"> Or </a>
                    </div>

                    <button 
                        className="mt-4 flex items-center w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleGoogleSignIn}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </>
    )
}
