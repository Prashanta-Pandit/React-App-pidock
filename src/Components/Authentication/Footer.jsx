import React from 'react';

export default function Footer() {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-black">
        <div className="text-center py-2">
          <span className="ml-4 text-lg font-normal text-white">
                {getCurrentYear()} © magpies.online | All rights reserved 
          </span>
        </div>
      </footer>
    </>
  );
}

