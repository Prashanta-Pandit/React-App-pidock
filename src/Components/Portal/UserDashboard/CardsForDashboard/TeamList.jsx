import React from 'react';

const TeamList = ({ firstName, lastName, email }) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{firstName} {lastName}</div>
        <p className="text-gray-700 text-base">{email}</p>
      </div>
    </div>
  );
}

export default TeamList;


