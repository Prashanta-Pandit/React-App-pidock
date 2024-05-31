import React, { useState, useEffect } from 'react'; // useState and useEffect hooks.
import SignoutButton from '../SignOut/SignoutButton';

export default function Portal() {
  const [signedInUserId, setSignedInUserId] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('signedInUserUid'); // this is user id that is stored after signing in from signin page. 
    if (userId) {
      setSignedInUserId(userId);
    }
  }, []); // Empty dependency array means this runs once on mount

  const [count, setCount] = useState(0);
  const [calculation, setCalculation] = useState(0);


  useEffect(() =>{
    setCalculation((count * 2))
   }, [count]
  )


  function countWhenClicked(){
    setCount((c) =>  c + 1);
  }

  return (
    <>
    <div className="mt-24 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <p>Your user id is: {signedInUserId}, & you are on the Portal now.</p>
          <SignoutButton />
    </div>
    <div className="mt-40 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
             <p>Example of UseEffect</p>
              <p>Count: {count}</p>
              <button 
              className="rounded-md bg-black py-2 px-2 text-sm text-white font-bold shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
               onClick ={countWhenClicked}
               >+</button>
              <p>Calculation: {calculation}</p>
        </div>
  </>
  );
}
