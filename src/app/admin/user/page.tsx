"use client";
import Loading from "../../../components/Loading";
import { UserRole } from "../../../../node_modules/.prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

interface User {
  email: string;
  name: string;
  role: string;
  products: Product[];
  address: Address[];
  orders: Order[];
}
interface Product {
  id: string;
  name: string;
}

interface Address {
  id: string;
  street: string;
}

interface Order {
  id: string;
  orderDate: Date;
}

const User = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await axios.get("/api/get-user");
        if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
          setLoading(false);
          console.log(response);
        } else {
       
          setUsers([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchusers();
  }, []);

  useEffect(() => {
    const results = users?.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results || []);
  }, [searchTerm, users]);

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };
  

  const handleRoleChange = async (email: string, newRole: UserRole) => {
    try {
        const response = await axios.post('/api/updated-role', {
          email,
          newRole,
        });
      
        if(response.data){
           toast.success("Updated!!") 
        }else{
            toast.error("Not Updated")
        }
        
       
    
      } catch (error) {
        console.error('Update failed:', error);
      toast.error("Error")
      }
  };
  if (loading) {
    return (
      <div className="text-center p-4 w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container w-full p-4">
      <h1 className="text-2xl font-bold mb-4">User Schema</h1>
      <div className="rounded-md border">
           <div className="flex  mt-2 w-full px-4">
                  <div className="flex justify-between w-full items-center bg-white p-2 rounded-md">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full text-gray-800 text-[14px]  outline-none bg-transparent"
                    />
                    <FaSearch className="text-green-800 cursor-pointer" />
                  </div>
                </div>
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr >
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs  font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium hidden md:table-cell   text-gray-500 uppercase tracking-wider"
              >
                email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs hidden md:table-cell  font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs  font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs hidden md:table-cell  lg:flex  font-medium text-gray-500 uppercase tracking-wider"
              >
                Order
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users && users.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.email} >
                  <td className="px-6  py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.name}
                  </td>
                  <td className="px-6 self-start hidden md:table-cell  py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 hidden md:table-cell  py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.products?.length || 0}
                  </td>
                  <td className="px-6  py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={user.role} 
                      onChange={(e) =>
                        handleRoleChange(user.email, e.target.value as UserRole)
                      }
                      className="w-auto p-1 outline-none"
                    >
                      {Object.values(UserRole).map((role) => (
                        <option key={role} value={role} className="p-1">
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell  whitespace-nowrap text-sm text-gray-500">
                    {user.orders?.length || 0}
                  </td>
                </tr>
              ))
            ) : (
              <p>No Users</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
