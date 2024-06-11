import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

import { fireStoreCollectionReference } from '../../../FirebaseInitialisation';
import { onSnapshot } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

import AddEmployeeButton from './AddEmployeeButton';

export default function TeamList() {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [addEmployeeButtonClicked, setAddEmployeeButtonClicked] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(fireStoreCollectionReference, (snapshot) => {
      const Details = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployeeDetails(Details);
    });
    return () => unsubscribe(); // clean up the listener.
  }, []);
  
  const addEmployee = () =>{
    setAddEmployeeButtonClicked(true);
  }

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold">Employees</h2>
            <p className="mt-1 text-sm text-gray-700">
              This is a list of all employees. You can add new employees, edit or delete existing
              ones.
            </p>
          </div>
          <div className='bg-black text-white rounded-md shadow-md p-2 hover:bg-green-800 hover:text-white'>
              <AddEmployeeButton />
          </div>
        </div>
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="border border-gray-200 md:rounded-lg">
                <div className="max-h-96 overflow-y-auto"> {/* Added styles for fixed height and vertical scrolling */}
                  <table className="min-w-full divide-y divide-gray-200 relative">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span>Employee</span>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 hidden md:table-cell"
                        >
                          Department
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 hidden md:table-cell"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 hidden md:table-cell"
                        >
                          Role
                        </th>
                        <th scope="col" className="relative px-4 py-3.5">
                          <span className="sr-only"></span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {employeeDetails.map((employee) => (
                        <tr key={employee.name}>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover bg-gray-400"
                                  // src={employee.image}
                                  alt=''
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                                <div className="text-sm text-gray-700">{employee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 hidden md:table-cell">
                            <div className="text-sm text-gray-700">{employee.department}</div>
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
                            <Trash2 className='cursor-pointer size-5 text-red-700' />
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
    </>
  );
}








