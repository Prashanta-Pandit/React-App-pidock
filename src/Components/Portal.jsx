import React, { useState, useEffect } from 'react'; // useState and useEffect hooks.
import Signout from './Signout'; // Ensure this path is correct

export default function Portal() {
  const [signedInUserEmail, setSignedInUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('signedInUserEmail'); // this is user email that is stored after signing in from signin page. 
    if (email) {
      setSignedInUserEmail(email);
    }
  }, []); // Empty dependency array means this runs once on mount

  console.log('user in portal: ',signedInUserEmail); // Log the actual email

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />      
      <br />
      <br />
      <br />
      <br />
      <p>You are in Portal now. {signedInUserEmail}</p>
    </>
  );
}
