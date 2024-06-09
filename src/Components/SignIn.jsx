import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth, fireStoreCollectionReference } from './FirebaseInitialisation';
import { signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { onSnapshot ,addDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

import { LoaderCircle } from 'lucide-react'
//favicon icons and fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function SignIn() {

    const [isSignInButtonClicked, setIsSignInButtonClicked] = useState(false);
    const [isGoogleSignInButtonClicked, setIsGoogleSignInButtonClicked ] = useState(false);

    //use dom function, useNavigate() to naviagate to pages.
    const navigate = useNavigate(); 

    function handleCreateAccount() {
        navigate('/register');
    }
    
    function handleForgotPassword(event) {
        event.preventDefault(); 
        navigate('/forgotPassword');
    }

    function redirectToDashboard(signedInUser) {

        // storing the signed in user unique uid in local storgae. This helps in locating a seperate portal for signed user. 
        //This is a unique which has been stored in firestore as well, it will help to retrive other data from firebase.
        localStorage.setItem('signedInUserUid', signedInUser.uid)
            navigate('/portal/dashboard');
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            redirectToDashboard(user);
        } else {
            console.log('No user is signed in.');
        }
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const formatEmail = (str) => {
       return str.toLowerCase();
    }

    function handleSignInOnSubmit(e) {
        e.preventDefault();
        
        // make it true when clciked.
        setIsSignInButtonClicked(true);

        // submit the formatted email.
        const formatedEmail = formatEmail(email);

        signInWithEmailAndPassword(auth, formatedEmail, password)
            .then((userCredential) => {
                const user = userCredential.user;
                redirectToDashboard(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Login error:', errorCode, errorMessage);
                if (errorCode === 'auth/invalid-credential') {
                    alert('Wrong email or password. Or, if this is a google account, try Continue with google option.');
                }
            })
    }
     // setting up the timer for sign in button click. 
     useEffect(()=>{
        let timer;
        if(isSignInButtonClicked){
            timer = setTimeout(()=>{
                setIsSignInButtonClicked(false);
            }, 2000)
        }
        return () => clearTimeout(timer);

    }, [isSignInButtonClicked]);
    
    //handle sign in with google 
    function handleGoogleSignIn() {

        setIsGoogleSignInButtonClicked(true);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;  // retrive the user details in an array of Objects. 
                console.log(user);

                const q = query(fireStoreCollectionReference, where("userLoginId", "==", user.uid))
                onSnapshot(q, (snapshot) => {
                    const details = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); // get the details in array.
                    
                    // only add users details, if the user is new. 
                    if(details.length === 0){
                        // Extracting user's first name, last name, and email from Google 
                        const firstNameFromGoogle = user.displayName.split(' ')[0];
                        const lastNameFromGoogle = user.displayName.split(' ')[1];
                        const emailFromGoogle = user.email;
                        const userLoginId = user.uid;
                        
                        // this returns the add the details in firbase store.
                        return addDoc(fireStoreCollectionReference,{
                            userLoginId: userLoginId,
                            firstName: firstNameFromGoogle,
                            lastName: lastNameFromGoogle,
                            email:emailFromGoogle
                        })
                        .then(
                            redirectToDashboard(user)
                        )
                        .catch((error) =>{
                            console.error('Error updating user details:', error);
                        })
                    }
                    else{
                        redirectToDashboard(user); // if the array is not empty than, redirect to dashboard. 
                        console.log('User already exist, in firestore db.');
                    }
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Google sign-in error:', errorCode, errorMessage);
            })
    }

    return (
        // making sure that the loading spinner run before retriving to dashboard.jsx
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
                                <input id="email" name="email" type="email" autoComplete="current-email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/>
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
                                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="flex w-full items-center justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:ring-black"
                            >
                            {isSignInButtonClicked ? (
                                <div className="flex items-center space-x-2">
                                   <LoaderCircle className="animate-spin" />
                                   <span>Signing you in...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                          </button>
                        </div>
                    </form>

                    <button 
                        className="font-light text-black hover:text-slate-700 focus:outline-none mt-4" 
                        onClick={handleCreateAccount}
                    >
                        No account? Create
                    </button>

                    <div className="flex items-center sm:mx-auto sm:w-full sm:max-w-sm my-3">
                        <hr className="flex-grow border-t border-gray-600"></hr>
                        <span className="mx-2 text-center text-sm font-light text-gray-600">or</span>
                        <hr className="flex-grow border-t border-gray-600"></hr>
                    </div>

                    <button 
                        className="flex items-center font-bold justify-center w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 transition-transform duration-300 transform hover:scale-105"
                        onClick={handleGoogleSignIn}
                    >
                        {
                            !isGoogleSignInButtonClicked ? (
                                <>
                                   <FontAwesomeIcon icon={faGoogle} className="mr-2" size='2xl' style={{color: "#ff0000"}} />
                                   <span className="relative">Continue with Google</span>
                                </>
                            ):(
                                <>
                                   <FontAwesomeIcon icon={faGoogle} className="mr-2" size='2xl' style={{color: "#ff0000"}} />
                                   <span className="relative font-light">Connecting you to Google services...</span>
                                </>
                            )
                        }
                    </button>
                </div>
            </div>
    )
}
