import React, { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { fireStoreCollectionReference } from '../../../FirebaseInitialisation';
import { onSnapshot, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

export default function TeamList() {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [signedInUserId, setSignedInUserId] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('signedInUserUid');
    if (userId) {
      setSignedInUserId(userId);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(fireStoreCollectionReference, (snapshot) => {
      const details = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployeeDetails(details);
    });
    return () => unsubscribe(); // clean up the listener.
  }, []);

  function handleTableRowClick(employee) {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const deleteEmployee = (documentId, employeeLoginId) => {
    if (employeeLoginId !== signedInUserId) {
      deleteDoc(doc(fireStoreCollectionReference, documentId))
        .then(() => {
          console.log(`Document with ID ${documentId} deleted successfully.`);
        })
        .catch((error) => {
          console.error('Error deleting document:', error);
        });
    } else {
      console.log('This user is logged in to this portal.');
    }
  };

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
                        <tr className='hover:bg-gray-100 cursor-pointer' key={employee.id} onClick={() => handleTableRowClick(employee)}>
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
                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                            <Trash2 
                              className={`cursor-pointer size-5 ${employee.userLoginId === signedInUserId ? 'text-gray-400' : 'text-red-700 hover:text-blue-700'}` }
                              onClick={() => deleteEmployee(employee.id, employee.userLoginId)}
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
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg z-10 p-8 w-full max-w-md">
            <div className="flex justify-end">
                <X className="cursor-pointer hover:bg-red-600 hover:text-white" onClick={closeModal} />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Employee Details</h2>
            <div className="mb-4">
              <strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}
            </div>
            <div className="mb-4">
              <strong>Email:</strong> {selectedEmployee.email}
            </div>
            <div className="mb-4">
              <strong>Department:</strong> {selectedEmployee.department}
            </div>
            <div className="mb-4">
              <strong>Role:</strong> {selectedEmployee.role}
            </div>
            <div className="mb-4">
              <strong>Status:</strong> {selectedEmployee.status}
            </div>
          </div>
        </div>
      )}
    </>
  );
}











