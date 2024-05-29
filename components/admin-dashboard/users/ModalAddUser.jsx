import { useState, useEffect } from "react";
import axios from "axios";

const ModalAddUser = ({onUserAdded}) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    password: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
      if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        throw new Error("Fetched data is not in the expected format");
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, newUser);
      onUserAdded(); // Fetch users again to update the list
      document.getElementById("my_modal_5").close(); // Close the modal
      setNewUser({ email: "", username: "", password: "", role: "user" }); // Reset form
    } catch (error) {
      console.log("Error adding user:", error);
    }
  };

  return (
    <>
      <button className="btn bg-[#204d9c] text-white" onClick={() => document.getElementById("my_modal_5").showModal()}>
        เพิ่มผู้ใช้ใหม่
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">เพิ่มสมาชิก</h3>
          <p className="py-4">กด ESC หรือปุ่มปิดเพื่อปิดหน้าต่าง</p>
          <div className="modal-action block justify-center ">
            <form onSubmit={handleSubmit}>
              <label className="input input-bordered flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input type="text" name="email" value={newUser.email} onChange={handleChange} className="grow" placeholder="Email" required />
              </label>
              <label className="input input-bordered flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" name="username" value={newUser.username} onChange={handleChange} className="grow" placeholder="Username" required />
              </label>
              <label className="input input-bordered flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input type="password" name="password" value={newUser.password} onChange={handleChange} className="grow" placeholder="Password" required />
              </label>
              <select name="role" value={newUser.role} onChange={handleChange} className="select select-bordered w-full mb-2" required>
                <option disabled>สิทธิ์การใช้งาน</option>
                <option value="admin">Admin</option>
                <option value="member">User</option>ฟ
              </select>
              <div className="flex justify-end ">
                <button type="submit" className="btn text-white bg-[#204d9c]">
                  บันทึก
                </button>
                <button type="button" className="btn btn-error text-white" onClick={() => document.getElementById("my_modal_5").close()}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalAddUser;
