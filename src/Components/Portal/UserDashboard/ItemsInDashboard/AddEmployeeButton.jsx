import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddEmployeeModal() {
  const [isCloseButtonClicked, setIsCloseButtonClicked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleCloseModal = () => {
    setIsCloseButtonClicked(false);
  };

  return (
    <>
      {isCloseButtonClicked && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-end">
              <X className="cursor-pointer hover:bg-red-600 hover:text-white" onClick={handleCloseModal} />
            </div>
            <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
      
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="mb-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="mt-1 p-2 block w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="mt-1 p-2 block w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  className="mt-1 p-2 block w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  className="mt-1 p-2 block w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4 col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 p-2 block w-full border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end col-span-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-2 rounded-md bg-white px-4 py-2 text-sm  text-black shadow-sm hover:bg-gray-200 border border-gray-500 border-solid"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-400"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button  onClick={() => setIsCloseButtonClicked(true)}> Add </button>
    </>
  );
}


