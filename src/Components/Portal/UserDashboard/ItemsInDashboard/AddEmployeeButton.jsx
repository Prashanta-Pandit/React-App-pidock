import React, { useState, useEffect } from 'react';
import { fireStoreEmployeeCollectionReference, firebaseStorage } from '../../../FirebaseInitialisation';
import { X, LoaderCircle } from 'lucide-react';
import { addDoc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js';

const AddEmployeeButton = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [pictureName, setPictureName] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  // Regular expression to check if the input contains a number.
  const containsNumber = (str) => /\d/.test(str);

  // Handler for input changes to clear error messages
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessage('');
  };

  const formatInput = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Function to handle file upload for profile picture
  async function handleImageUpload(image) {
    const imageRef = ref(firebaseStorage, `employeeProfilePictures/${image.name}`);
    try {
      await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsAddButtonClicked(true);

    const formattedFirstName = formatInput(firstName);
    const formattedLastName = formatInput(lastName);
    const formattedDepartment = department.toUpperCase();
    const formattedRole = formatInput(role);
    const formattedEmail = email.toLowerCase(); // typically form is formatted in lower case.

    let newProfilePictureURL = profilePictureURL;
    if (profilePicture) {
      newProfilePictureURL = await handleImageUpload(profilePicture);
      setProfilePictureURL(newProfilePictureURL);
    }

    const employeeDetailsToAdd = {
      firstName: formattedFirstName,
      lastName: formattedLastName,
      email: formattedEmail,
      department: formattedDepartment,
      role: formattedRole,
      profilePictureURL: newProfilePictureURL
    };

    if (containsNumber(firstName) || containsNumber(lastName) || containsNumber(department) || containsNumber(role)) {
      setErrorMessage('Input field should not contain number.');
      setIsAddButtonClicked(false);
    } else {
      // Handle form submission
      try {
        await addDoc(fireStoreEmployeeCollectionReference, employeeDetailsToAdd);
        setIsModalVisible(false);
      } catch (error) {
        const errorMessage = error.message;
        const errorCode = error.code;
        console.error("Add employee error:", errorCode);
        console.error("Add employee error:", errorMessage);
      }
      setIsAddButtonClicked(false);
    }
  }

  useEffect(() => {
    let timer;
    if (isAddButtonClicked) {
      timer = setTimeout(() => {
        setIsAddButtonClicked(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isAddButtonClicked]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-end">
              <X className="cursor-pointer hover:text-red-600 text-black" onClick={handleCloseModal} />
            </div>
            <h2 className="text-black text-lg font-semibold mb-4">Add New Employee</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {errorMessage && (
                <div className="text-red-500 text-sm col-span-2">{errorMessage}</div>
              )}
              <div className="mb-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleInputChange(setFirstName)}
                  className="mt-1 p-2 block w-full border rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={handleInputChange(setLastName)}
                  className="mt-1 p-2 block w-full border rounded-mdt text-black"
                  required
                />
              </div>
              <div className="mb-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={role}
                  onChange={handleInputChange(setRole)}
                  className="mt-1 p-2 block w-full border rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-4 col-span-1">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={department}
                  onChange={handleInputChange(setDepartment)}
                  className="mt-1 p-2 block w-full border rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-4 col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className="mt-1 p-2 block w-full border rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-4 col-span-2">
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"            
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfilePicture(e.target.files[0]);
                      setPictureName(e.target.files[0].name);
                    }
                  }}
                />
                {pictureName && (
                  <p className="text-sm text-gray-500 mt-2">Selected Picture: {pictureName}</p>
                )}
              </div>
              <div className="flex justify-end col-span-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-2 rounded-md bg-white px-4 py-2 text-sm text-black shadow-sm hover:bg-gray-200 border border-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 flex items-center space-x-2"
                >
                  {isAddButtonClicked ? (
                    <div className="flex items-center space-x-2">
                      <LoaderCircle className="animate-spin" />
                      <span>Adding...</span>
                    </div>
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <button className="add-employee-button bg-black text-white rounded-md shadow-md p-2 hover:bg-green-800 hover:text-white" onClick={() => setIsModalVisible(true)}>
        <span className="hidden sm:inline">Add Employee</span>
        <span className="inline sm:hidden">+</span>
      </button>
    </>
  );
}

export default AddEmployeeButton ;




   
