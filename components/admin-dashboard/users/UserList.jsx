"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import { Pencil, Trash } from "lucide-react";
import Spinner from "../../spinner/Spinner";
import ModalAddUser from "./ModalAddUser";
import ModalEditUser from "./ModalEditUser";


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`
      );
      if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        throw new Error("Fetched data is not in the expected format");
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`);
      fetchUsers(); // Fetch users again to update the list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  // Logic for displaying users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = users.filter((user) => {
    return (
      (filterRole ? user.roles === filterRole : true) &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <div className="mb-2 flex justify-between">
                <div className="join">
                  <input
                    className="input input-bordered join-item"
                    placeholder="ค้นหา"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="select select-bordered join-item"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="">กรอง</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <div className="indicator">
                    <button className="btn bg-[#204d9c] text-white join-item">
                      ค้นหา
                    </button>
                  </div>
                </div>
                <div>
                  <ModalAddUser onUserAdded={fetchUsers} />
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>ชื่อผู้ใช้</th>
                    <th>อีเมล</th>
                    <th>สิทธิ์การใช้งาน</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(currentUsers) && currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr className="hover" key={user.userId}>
                        <th>{user.userId}</th>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.roles}</td>
                        <td>
                          <button onClick={() => handleEditClick(user)} className="text-blue-500">
                            <Pencil />
                          </button>
                          <button
                            onClick={() => handleDelete(user.userId)}
                            className="text-red-500"
                          >
                            <Trash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th>#ID</th>
                    <th>ชื่อผู้ใช้</th>
                    <th>อีเมล</th>
                    <th>สิทธิ์การใช้งาน</th>
                    <th>จัดการ</th>
                  </tr>
                </tfoot>
              </table>
              <div className="flex justify-center mt-4">
               
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedUser && <ModalEditUser user={selectedUser} onUserUpdated={fetchUsers} />}
    </>
  );
};

export default UserList;
