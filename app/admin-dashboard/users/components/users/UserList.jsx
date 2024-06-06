"use client";
import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
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
  CardFooter,
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

const fetcher = (url) => axios.get(url).then(res => res.data);

const UserListContent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, fetcher);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page')) || 1;
    setCurrentPage(page);
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`);
      mutate(); // Refresh the user list
      toast({
        title: "Success",
        description: "ลบผู้ใช้สำเร็จ",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการลบผู้ใช้",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  // Logic for displaying users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = (data?.users || []).filter((user) => {
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
      {!data ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
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

              <div className="">
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
                            onClick={() => handleDelete(user.userId)}
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
                      <TableCell colSpan="5" className="text-center">
                        ไม่พบผู้ใช้
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      {selectedUser && (
        <ModalEditUser user={selectedUser} onUserUpdated={mutate} />
      )}
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
  