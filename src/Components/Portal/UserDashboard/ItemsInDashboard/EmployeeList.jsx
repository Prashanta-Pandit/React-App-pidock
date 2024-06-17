import React, { useEffect, useState } from 'react';
import { Trash2, Pencil, X } from 'lucide-react';
import { fireStoreEmployeeCollectionReference, firebaseStorage } from '../../../FirebaseInitialisation';
import { onSnapshot, doc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js';
import AddEmployeeButton from './AddEmployeeButton';

export default function TeamList() {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(fireStoreEmployeeCollectionReference, (snapshot) => {
      const details = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployeeDetails(details);
    });
    return () => unsubscribe(); // Clean up the listener
  }, []);

  function handleTableRowClick(employee) {
    setSelectedEmployee(employee);
    setIsDisplayModalOpen(true);
  }

  function handleEditButtonClick(event, employee) {
    event.stopPropagation(); // Prevent triggering the row click event
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  }

  const closeModal = () => {
    setIsDisplayModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const deleteEmployee = (event, documentId) => {
    event.stopPropagation(); // Prevent triggering the row click event
    deleteDoc(doc(fireStoreEmployeeCollectionReference, documentId))
      .then(() => {
        console.log(`Document with ID ${documentId} deleted successfully.`);
      })
      .catch((error) => {
        console.error('Error deleting document:', error);
      });
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessage('');
  };

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
    setIsUpdateButtonClicked(true);

    try {
      let newProfilePictureURL = profilePictureURL;
      if (profilePicture) {
        newProfilePictureURL = await handleImageUpload(profilePicture);
        setProfilePictureURL(newProfilePictureURL);
      }

      await updateDoc(doc(fireStoreEmployeeCollectionReference, selectedEmployee.id), {
        firstName: firstName,
        lastName: lastName,
        department: department,
        role: role,
        email: email,
        profilePictureURL: newProfilePictureURL
      });

      setIsEditModalOpen(false);
      setIsUpdateButtonClicked(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating document:', error);
      setErrorMessage('Error updating document');
    }
  }

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold">Employees</h2>
            <p className="mt-1 text-sm text-gray-700">
              This is a list of all employees. You can add new employees, edit or delete existing ones.
            </p>
          </div>
          <div className='bg-black text-white rounded-md shadow-md p-2 hover:bg-green-800 hover:text-white'>
              <AddEmployeeButton />
          </div>
        </div>
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="border border-gray-300 md:rounded-lg">
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200 relative">
                    <thead className="bg-gray-300 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-normal text-black">
                          <span>Employee</span>
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-normal text-black hidden md:table-cell">
                          Department
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-normal text-black hidden md:table-cell">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-normal text-black hidden md:table-cell">
                          Role
                        </th>
                        <th scope="col" className="relative px-4 py-3.5">
                          <span className="sr-only"></span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {employeeDetails.map((employee) => (
                        <tr className='hover:bg-gray-100' key={employee.id} onClick={() => handleTableRowClick(employee)}>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover bg-gray-400"
                                  src={employee.profilePictureURL}
                                  alt='No image'
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-m font-semibold text-gray-900">{employee.firstName} {employee.lastName}</div>
                                <div className="text-sm text-gray-700">{employee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 hidden md:table-cell">
                            <div className="text-sm text-gray-700"> {employee.department}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 hidden md:table-cell">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 hidden md:table-cell">
                            {employee.role}
                          </td>
                          <td className=" flex flex-row justify-between whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                            <Pencil className='cursor-pointer size-5 text-blue-600' onClick={(event) => handleEditButtonClick(event, employee)}/>
                            <Trash2 
                              className='cursor-pointer size-5 text-red-600'
                              onClick={(event) => deleteEmployee(event, employee.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Display Modal */}
      {isDisplayModalOpen && selectedEmployee && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div className="bg-white rounded-lg p-8 z-50 max-w-lg w-full">
              <div className='flex flex-row justify-between items-center'>
                <X className="cursor-pointer text-gray-700 hover:bg-red-600 hover:text-white" onClick={closeModal}/>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  className="h-32 w-32 rounded-full object-cover border-2 border-gray-300"
                  src={selectedEmployee.profilePictureURL}
                  alt='No image'
                /> 
              </div>
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
              </div>
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-500">{selectedEmployee.role}</p>
              </div>
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
              </div>
            </div>
          </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="bg-white rounded-lg p-6 z-50 max-w-sm w-full relative">
              <div className='flex flex-row justify-between items-center'>
                <X className="cursor-pointer text-gray-700 hover:bg-red-600 hover:text-white" onClick={closeModal}/>
              </div>
            <h2 className="text-xl font-semibold mb-4 text-center">Edit Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={selectedEmployee.profilePictureURL}
                    alt="No Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                type="text"
                className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black placeholder:text-gray-400 focus:ring-0"
                placeholder={selectedEmployee.firstName}
                value={selectedEmployee.firstName}
                onChange={handleInputChange(setFirstName)}
              />

              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black placeholder:text-gray-400 focus:ring-0 "
                  placeholder={selectedEmployee.lastName}
                  value={selectedEmployee.lastName}
                  onChange={handleInputChange(setLastName)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black placeholder:text-gray-400 focus:ring-0 "
                  placeholder={selectedEmployee.email}
                  value={selectedEmployee.email}
                  onChange={handleInputChange(setEmail)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black placeholder:text-gray-400 focus:ring-0 "
                  placeholder={selectedEmployee.department}
                  value={selectedEmployee.department}
                  onChange={handleInputChange(setDepartment)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black placeholder:text-gray-400 focus:ring-0"
                  placeholder={selectedEmployee.role}
                  value={selectedEmployee.role}
                  onChange={handleInputChange(setRole)}
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-400 hover:text-black w-full"
                disabled={isUpdateButtonClicked}
              >
                Save
              </button>
              {errorMessage && (
                <p className="mt-2 text-red-600 text-center">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>
     )}

    </>
  );
}











