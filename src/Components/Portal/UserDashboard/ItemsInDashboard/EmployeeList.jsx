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

    //check for input valiadation.
    if (containsNumber(firstName) || containsNumber(lastName) || containsNumber(department) || containsNumber(role)) {
      setErrorMessage('Input field should not contain number.');
      setIsUpdateButtonClicked(false);
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

          setIsEditModalOpen(false);
          setIsUpdateButtonClicked(false);
          setSelectedEmployee(null);
        } catch (error) {
          console.error('Error updating document:', error);
          setErrorMessage('Error updating document');
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

      {isEditModalOpen &&  (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <div className="flex justify-end">
              <X className="cursor-pointer" onClick={closeModal} />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-m font-medium text-gray-700">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={firstName}
                  onChange={handleInputChange(setFirstName)}
                  placeholder={firstName}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-m font-medium text-gray-700">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={lastName}
                  onChange={handleInputChange(setLastName)}
                  placeholder={lastName}
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-m font-medium text-gray-700">Department</label>
                <input
                  id="department"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={department}
                  onChange={handleInputChange(setDepartment)}
                  placeholder={department}
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-m font-medium text-gray-700">Role</label>
                <input
                  id="role"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={role}
                  onChange={handleInputChange(setRole)}
                  placeholder={role}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-m font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  placeholder={email}
                />
              </div>
              <div>
                <label htmlFor="profilePicture" className="block text-m font-medium text-gray-700">Profile Picture</label>
                <input
                  id="profilePicture"
                  type="file"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
              </div>
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-slate-400 hover:text-black ${isUpdateButtonClicked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isUpdateButtonClicked}
                >
                  {isUpdateButtonClicked ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}












