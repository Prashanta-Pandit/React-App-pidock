import React, { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { fireStoreEmployeeCollectionReference } from '../../../FirebaseInitialisation';
import { onSnapshot, query, where, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js';

export default function EditEmployeeButton(){

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [pictureName, setPictureName] = useState('');
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [isUpdateButtonClicked, setIsUpdateButtonClicked] = useState(false);
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

    async function handleSubmit(e){
        e.preventDefault();
        setIsUpdateButtonClicked(true);

        try{
            let newProfilePictureURL = profilePictureURL;
            if (profilePicture) {
                newProfilePictureURL = await handleImageUpload(profilePicture);
                setProfilePictureURL(newProfilePictureURL);
            }


        }
        catch{

        }

    }

    return(
        <>
        {isModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-end">
                <X className="cursor-pointer hover:text-red-600 text-black" onClick={handleCloseModal} />
              </div>
              <h2 className="text-black text-lg font-semibold mb-4">Update the details</h2>
  
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
                    className="mt-1 p-2 block w-full border rounded-md"
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
                    className="mt-1 p-2 block w-full border rounded-md"
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
                    className="mt-1 p-2 block w-full border rounded-md"
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
                    className="mt-1 p-2 block w-full border rounded-md"
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
                    className="mt-1 p-2 block w-full border rounded-md"
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
                    {isUpdateButtonClicked ? (
                      <div className="flex items-center space-x-2">
                        <LoaderCircle className="animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        <button onClick={() => setIsModalVisible(true)}>
          <Pencil  className='cursor-pointer size-5 text-blue-600'/>
        </button>
      </>
    )

}