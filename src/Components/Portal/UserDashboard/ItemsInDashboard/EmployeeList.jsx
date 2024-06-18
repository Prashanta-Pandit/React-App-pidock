import React, { useEffect, useState } from 'react';
import { Trash2, Pencil, X, LoaderCircle } from 'lucide-react';
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
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [isUpdateButtonClicked, setIsUpdateButtonClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // Regular expression to check if the input contains a number.
  const containsNumber = (str) => /\d/.test(str);

  const formatInput = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  function handleEditButtonClick(event, employee) {
    event.stopPropagation(); // Prevent triggering the row click event
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
    setFirstName(employee.firstName);
    setLastName(employee.lastName);
    setDepartment(employee.department);
    setRole(employee.role);
    setEmail(employee.email);
    setProfilePictureURL(employee.profilePictureURL);
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
    setIsLoading(true);

    // Check for input validation.
    if (containsNumber(firstName) || containsNumber(lastName) || containsNumber(department) || containsNumber(role)) {
      setErrorMessage('Input field should not contain number.');
      setIsUpdateButtonClicked(false);
      setIsLoading(false);
    } else {
      try {
        let newProfilePictureURL = profilePictureURL;
        if (profilePicture) {
          newProfilePictureURL = await handleImageUpload(profilePicture);
          setProfilePictureURL(newProfilePictureURL);
        }

        await updateDoc(doc(fireStoreEmployeeCollectionReference, selectedEmployee.id), {
          firstName: formatInput(firstName) || selectedEmployee.firstName,  // the default value in a input is : selectedEmployee.firstname if the user dont make any changes. 
          lastName: formatInput(lastName) || selectedEmployee.lastName,
          department: department.toUpperCase() || selectedEmployee.department,
          role: formatInput(role) || selectedEmployee.role,
          email: email.toLowerCase() || selectedEmployee.email,
          profilePictureURL: newProfilePictureURL
        });

        setTimeout(() => {
          setIsLoading(false);
          setIsEditModalOpen(false);
          setIsUpdateButtonClicked(false);
          setSelectedEmployee(null);
        }, 2000);
      } catch (error) {
        console.error('Error updating document:', error);
        setErrorMessage('Error updating document');
        setIsLoading(false);
        setIsUpdateButtonClicked(false);
      }
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
              {/* {<AddEmployeeButton addSubmitButtonClick={}/> }pass a prop here */}
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
                      {isLoading ? (
                        <tr>
                        <td colSpan="5" className="text-center py-4">
                          <div className="flex justify-center items-center">
                            <LoaderCircle className='animate-spin' />
                          </div>
                        </td>
                       </tr>
                      ) : (
                        employeeDetails.map((employee) => (
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
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Active
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 hidden md:table-cell">
                              <div className="text-sm text-gray-700">{employee.role}</div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right flex pt-7 justify-center space-x-4">
                              <button className="text-gray-500 hover:text-green-600" onClick={(event) => handleEditButtonClick(event, employee)}>
                                <Pencil size={18} />
                              </button>
                              <button className="text-gray-500 hover:text-red-600" onClick={(event) => deleteEmployee(event, employee.id)}>
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isDisplayModalOpen &&  (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <div className="flex justify-end">
              <X className="cursor-pointer" onClick={closeModal} />
            </div>
            <div className="flex flex-col items-center">
              <img className="h-40 w-40 rounded-full object-cover mb-4" src={selectedEmployee.profilePictureURL} alt='No image' />
              <h2 className="text-2xl font-semibold mb-2">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
              <p className="text-gray-700 mb-2">{selectedEmployee.email}</p>
              <p className="text-gray-700 mb-2">{selectedEmployee.department}</p>
              <p className="text-gray-700">{selectedEmployee.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Employee Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={handleInputChange(setFirstName)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={handleInputChange(setLastName)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="department">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  value={department}
                  onChange={handleInputChange(setDepartment)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="role">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={handleInputChange(setRole)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="profilePicture">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="hover:bg-gray-300 hover:text-black text-black py-2 px-4 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className='bg-black hover:bg-gray-500 hover:text-black text-white py-2 px-4 rounded'
                  disabled={isUpdateButtonClicked}
                >
                  {isUpdateButtonClicked ? (
                                <LoaderCircle className="mr-2 animate-spin" />
                            ) : (
                                <>Update</>
                            )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}












