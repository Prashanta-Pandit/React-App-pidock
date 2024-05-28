import { useState } from 'react';
import { auth } from './FirebaseInitialisation';
import { sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

// import to manage the page navigation. 
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword(){

    const [verify_email, setVerify_Email] = useState('');
    // the value of the div id: reset-request-send-message chnages when submit the button. so use the useState function. 
    const [message, setMessage] = useState('');

    // handle back button to sign in. 
    const goBack = useNavigate();
    function handleBackButton(){
        {/* go back to index. */}
        goBack('/');
    }

    // handle auth using firebase: forgot password 
    function handleForgetPasswordOnSubmit(e){
        e.preventDefault();
        sendPasswordResetEmail(auth, verify_email)
        .then(()=>{
            console.log('Password reset send.')
            setMessage('Password reset send, check your email.');
        })
        .catch(()=>{
            console.error('Error:', error);
            setMessage('Error sending password reset email.');
        });

    }
    return(
        <>
        <div className=" mt-10 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Forgot password</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* handle the onsubmit on form. */}
         <form className="space-y-6" onSubmit={handleForgetPasswordOnSubmit}>
            <div>
                <div className="flex items-center justify-between">
                <label htmlFor="verify_email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                </div>
                <div className="mt-2">
                <input id="verify_email" name="verify_email" type="email" autoComplete="current-email" required value={verify_email} onChange={(e)=>setVerify_Email(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
            </div>
            {/*Comment: adding a message when the state of this changes using useState. */}
            <div className='font-light'>
                <p>{message}</p>
            </div>

            <div>
                <button type="submit" className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Reset Password</button>
            </div>
         </form>
            <button className="font-light text-black hover:text-slate-700 focus:outline-none mt-4" 
                onClick={handleBackButton}>
                Back
            </button>
        </div>
        </div>
    </>
    )
}