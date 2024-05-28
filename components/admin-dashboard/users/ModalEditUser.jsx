import { useState, useEffect } from "react";
import axios from "axios";

const ModalEditUser = ({ user, onUserUpdated }) => {
  const [editUser, setEditUser] = useState({
    email: "",
    username: "",
    roles: "",
  });

  useEffect(() => {
    if (user) {
      setEditUser({
        email: user.email,
        username: user.username,
        roles: user.roles,
      });
      document.getElementById("edit_user_modal").showModal();
    }
  }, [user]);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.userId}`, editUser);
      onUserUpdated(); // Fetch users again to update the list
      document.getElementById("edit_user_modal").close(); // Close the modal
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  return (
    <dialog id="edit_user_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">แก้ไขข้อมูลผู้ใช้</h3>
        <div className="modal-action block justify-center">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                อีเมล
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={editUser.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={editUser.username}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Username"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="roles" className="block text-gray-700 text-sm font-bold mb-2">
                สิทธิ์การใช้งาน
              </label>
              <select
                name="roles"
                id="roles"
                value={editUser.roles}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                {editUser.roles === "admin" ? (
                  <>
                    <option value="admin">admin</option>
                    <option value="user">user</option>
                  </>
                ) : (
                  <>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="btn text-white bg-[#204d9c] mr-2">
                บันทึก
              </button>
              <button
                type="button"
                className="btn btn-error text-white"
                onClick={() => document.getElementById("edit_user_modal").close()}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalEditUser;
