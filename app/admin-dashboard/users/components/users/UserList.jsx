"use client";
import useSWR from "swr";
import axios from "axios";
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash } from 'lucide-react';
import Spinner from '@/components/spinner/Spinner';
import ModalAddUser from './ModalAddUser';
import ModalEditUser from './ModalEditUser';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Pagination from '@/components/Pagination'; // นำเข้า Pagination component
import { useToast } from '@/components/ui/use-toast';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'; // นำเข้า DeleteConfirmationDialog

const fetcher = (url) => axios.get(url).then(res => res.data);

const UserListContent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]); // สำหรับการเลือกหลายรายการ
  const [isDeleteMultipleOpen, setIsDeleteMultipleOpen] = useState(false); // สำหรับการลบหลายรายการ

  // Use SWR to fetch users data
  const { data, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, fetcher,{
    revalidateOnFocus: false,
    refreshInterval: 1000,
  });

  const users = Array.isArray(data) ? data : []; // ถ้า data ไม่เป็น array ให้ใช้ array ว่าง

  const handleDelete = async () => {
    if (!deleteUser) return;
    const optimisticUsers = users.filter(user => user.userId !== deleteUser.userId);
    mutate(optimisticUsers, false); // Optimistically update UI
    setDeleteUser(null); // Clear the delete user state
    setIsAlertOpen(false); // Close the alert dialog
    toast({
      title: "Success",
      description: "ลบผู้ใช้สำเร็จ",
      status: "success",
      variant: "success",
      isClosable: true,
    });

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${deleteUser.userId}`);
      mutate(); // Revalidate the cache
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการลบผู้ใช้",
        status: "error",
        isClosable: true,
      });
      // Revert the change in case of an error
      mutate();
    }
  };

  const handleDeleteSelected = async () => {
    const optimisticUsers = users.filter(user => !selectedUsers.includes(user.userId));
    mutate(optimisticUsers, false); // Optimistically update UI
    setSelectedUsers([]); // Clear selected users
    setIsDeleteMultipleOpen(false); // Close the alert dialog
    toast({
      title: "Success",
      description: "ลบผู้ใช้สำเร็จ",
      status: "success",
      variant: "success",
      isClosable: true,
    });

    try {
      await Promise.all(
        selectedUsers.map(userId => axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`))
      );
      mutate(); // Revalidate the cache
    } catch (error) {
      console.error('Error deleting users:', error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการลบผู้ใช้",
        status: "error",
        isClosable: true,
      });
      // Revert the change in case of an error
      mutate();
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteClick = (user) => {
    setDeleteUser(user);
    setIsAlertOpen(true); // Open the alert dialog
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.userId));
    }
  };

  // Logic for displaying users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = users.filter((user) => {
    return (
      (filterRole === 'all' ? true : user.roles === filterRole) &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    router.push(`?page=${pageNumber}`);
  };

  if (error) {
    return <div>Error fetching users</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>รายชื่อผู้ใช้</CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription>ค้นหาและจัดการผู้ใช้ในระบบ</CardDescription>
            <div className="flex justify-end">
              <ModalAddUser onUserAdded={mutate} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between items-center">
            <div className="flex space-x-2">
              <Input
                placeholder="ค้นหา"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                value={filterRole}
                onValueChange={(value) => setFilterRole(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="กรอง" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-[#204d9c] text-white">ค้นหา</Button>
            </div>
            <div>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={paginate}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>รายชื่อผู้ใช้ในระบบ</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedUsers.length === currentUsers.length}
                    />
                  </TableHead>
                  <TableHead>#</TableHead>
                  <TableHead>ชื่อผู้ใช้</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>สิทธิ์การใช้งาน</TableHead>
                  <TableHead>จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(currentUsers) && currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.userId)}
                          onChange={() => handleSelectUser(user.userId)}
                        />
                      </TableCell>
                      <TableCell>{filteredUsers.indexOf(user) + 1}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.roles}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleEditClick(user)}
                          variant="link"
                          className="text-blue-500"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(user)}
                          variant="link"
                          className="text-red-500"
                        >
                          <Trash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center">
                      ไม่พบผู้ใช้
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {selectedUsers.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <span>{selectedUsers.length} รายการที่เลือก</span>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteMultipleOpen(true)}
              >
                ลบรายการที่เลือก
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedUser && (
        <ModalEditUser user={selectedUser} onUserUpdated={mutate} />
      )}
      <DeleteConfirmationDialog
        open={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
      />
      <DeleteConfirmationDialog
        open={isDeleteMultipleOpen}
        onClose={() => setIsDeleteMultipleOpen(false)}
        onConfirm={handleDeleteSelected}
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedUsers.length} รายการนี้?`}
      />
    </>
  );
};

const UserList = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <UserListContent />
    </Suspense>
  );
};

export default UserList;
