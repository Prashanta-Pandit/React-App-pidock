import React, {useState} from 'react'; // useState and useEffect hooks.
import { useNavigate } from 'react-router-dom'; // this helps to navigate to the other pages. 

import { auth, fireStoreCollectionReference } from './FirebaseInitialisation';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { addDoc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';


export default function Registration(){

/***********************************************************/
    const navigate = useNavigate();
    // navigate to create page
    function handleIHaveAccount(){
        navigate('/');  // this is a path for Sign in page in the App.jsx
    };

    // handle redirection to Portal after a signin.
    function redirectToPortal(){
        navigate('/portal');
        
    }
/********************************************************* */

    // users inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailRegistration, setEmailRegistration] = useState('');
    const [passwordRegistration, setPasswordRegistration] = useState('');
    const [verify_PasswordRegistration, setVerify_PasswordRegistration] = useState('');

    //handle onSubmit form using firebase
    function handleCreateAccountOnSubmit(e){
        e.preventDefault();

      // firebase create user with email and password. 
        createUserWithEmailAndPassword(auth, emailRegistration, passwordRegistration)
        .then((userCredential)=>{
          //sign up successfully
            var user = userCredential.user;
            const userLoginId = user.uid; // get user login Id. 
        
            //adding user inputs in the firestore. add all these items in firestore.
            return addDoc(fireStoreCollectionReference, {
                        userLogiId: userLoginId,
                        firstName: firstName,
                        lastName: lastName,
                        email: emailRegistration
                    })
            })
            .then(()=>{
                // redirect user to the Portal.
                redirectToPortal();
            })
            .catch((error) => {
                // Handle sign-up errors
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error("Sign up error:", errorMessage);
            })

    {/* 

      // if only the users put the same password in the form, we direct to submit the form and store the data in the firestore. 
       if(setPasswordRegistration === setVerify_PasswordRegistration){
             
             // firebase create user with email and password. 
             createUserWithEmailAndPassword(auth, emailRegistration, passwordRegistration)
            .then((userCredential)=>{
                 //sign up successfully
                 var user = userCredential.user;
                 const userLoginId = user.uid; // get user login Id. 
 
                 //adding user inputs in the firestore. add all these items in firestore.
                 return addDoc(fireStoreCollectionReference, {
                             userLogiId: userLoginId,
                             firstName: firstName,
                             lastName: lastName,
                             emailA: emailRegistration
                         })
            })
            .then(()=>{
                // redirect user to the another page.
                window.location.href = 'https://www.magpies.online/';
            })
            .catch((error) => {
                // Handle sign-up errors
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error("Sign up error:", errorMessage);
            })

       } else{
          alert('Passwords doesnot match.')
          console.log(setPasswordRegistration);
          console.log(setVerify_PasswordRegistration);
       }
    
    
    */}
       
    }
    return(
        <>
            <div className="mt-10 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleCreateAccountOnSubmit}>
                <div>
                    <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium leading-6 text-gray-900">First name</label>
                    </div>
                    <div className="mt-2">
                    <input id="first_name" name="first_name" type="text" required value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                    </div>
                    <div className="mt-2">
                    <input id="last_name" name="last_name" type="text" required value={lastName} onChange={(e)=>setLastName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                    </div>
                    <div className="mt-2">
                    <input id="email" name="email" type="email" required value={emailRegistration} onChange={(e)=>setEmailRegistration(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    </div>
                    <div className="mt-2">
                    <input id="password" name="password" type="password"  required value={passwordRegistration} onChange={(e)=>setPasswordRegistration(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Verify Password</label>
                    </div>
                    <div className="mt-2">
                    <input id="verify_password" name="verify_password" type="password"  required value={verify_PasswordRegistration} onChange={(e)=>setVerify_PasswordRegistration(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                    </div>
                </div>

                <div>
                    <button type="submit" className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create account</button>
                </div>
             </form>
                <button className="font-light text-black hover:text-slate-700 focus:outline-none mt-4" 
                    onClick={handleIHaveAccount}>
                    I have a account
                </button>
            </div>
            </div>
        </>
    )
}