import React, { useEffect, useState } from "react";
import { deleteUser, getAllUsers } from "../../APIs/admin.services";
import Loader from "../atoms/Loader";
import Typography from "../atoms/Typography";
import moment from "moment/moment";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";

const UsersTable = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();

      if (allUsers.success && Array.isArray(allUsers.data)) {
        setUsersData([...allUsers.data]);
      } else {
        console.error("Unexpected API Response:", allUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const deleteAdminUSer = async () => {
    if (!selectedUser) return;

    setDeleteLoading(true);
    const response = await deleteUser({ email: selectedUser?.email });

    if (response?.success) {
      toast.success("User deleted successfully");
      setOpenModal(false);
      fetchAllUsers(); // Refetch the user data after successful deletion
    } else {
      toast.error("Error deleting user");
    }
    setDeleteLoading(false);
  };

  if (loading) {
    return <Loader className={"mx-auto mt-32 border-gray-900"} size="large" />;
  }

  return (
    <div className="overflow-x-auto p-4">
      {usersData.length === 0 ? (
        <Typography variant="h5" className="text-center mt-8">
          No Active Users
        </Typography>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{index}</td>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.username}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border text-center font-semibold">
                  {user.role}
                </td>
                <td className="px-4 py-2 border text-center">
                  {moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                </td>
                <td
                  className="px-4 py-2 border text-center "
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenModal(true);
                  }}
                >
                  <span className="bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {openModal && (
        <DeleteModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onDelete={deleteAdminUSer}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default UsersTable;
