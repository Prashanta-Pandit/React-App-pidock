import React, { useEffect, useState } from 'react'; // useState and useEffect hooks.
import SideNavBar from './SideNavBar';
import Spinner from '../Design/Spinner';
import ProfileTab from './ProfileTab';

export default function Portal() {
  const [loading, setLoading] = useState(true);

  // useEffect to render the loading spinner once when the page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <>
      {loading ? (
        <div className="mt-36 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <Spinner />
        </div>
      ) : (
        <div className="flex">
          <SideNavBar className="flex-shrink-0" />
          <div className="flex-grow flex justify-end pr-8">
            <ProfileTab />
          </div>
        </div>
      )}
    </>
  );
}
