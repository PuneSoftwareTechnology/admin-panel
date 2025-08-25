import React, { useEffect, useState } from "react";
import { deleteUser, getAllUsers } from "../../APIs/admin.services";
import Loader from "../atoms/Loader";
import Typography from "../atoms/Typography";
import TableView from "../Organims/TableView";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import PrimaryButton from "../atoms/PrimaryButton";
import { MdAdd } from "react-icons/md";
import CreateUserModal from "../Organims/CreateUserModal";

const UsersTable = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      if (response?.success && Array.isArray(response?.data)) {
        setUsersData(response.data);
      } else {
        setUsersData([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsersData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const deleteAdminUser = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      const response = await deleteUser({ email: selectedUser?.email });
      if (response?.success) {
        toast.success("User deleted successfully");
        setUsersData(
          usersData.filter((user) => user.email !== selectedUser.email)
        );
        setOpenModal(false);
      } else {
        toast.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting user");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loader className="mx-auto mt-32 border-gray-900" size="large" />;
  }

  const formattedData = usersData.map((user, index) => ({
    id: user.id || index,
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    role: user.role || "",
    created_at: user.createdAt,
  }));

  const colorScheme = {
    SUPER_ADMIN: "bg-green-700",
    ENQUIRY_MANAGER: "bg-blue-600",
    MARKETING_PERSON: "bg-purple-600",
  };

  const customComponents = {
    Role: ({ value }) => (
      <span
        className={`text-white text-xs font-semibold px-2 py-1 rounded-md ${
          colorScheme[value] || "bg-gray-400"
        }`}
      >
        {value}
      </span>
    ),
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h3">Users</Typography>
        <PrimaryButton
          onClick={() => {
            setSelectedUser(null);
            setOpenCreateModal(true);
          }}
        >
          <MdAdd size={24} color="white" /> Add User
        </PrimaryButton>
      </div>

      <TableView
        data={formattedData}
        columnStyleMap={customComponents}
        headers={["ID", "Name", "Username", "Email", "Role", "Created At"]}
        onDelete={(user) => {
          setSelectedUser(user);
          setOpenModal(true);
        }}
        onRowClick={(user) => {
          setSelectedUser(user);
          setOpenCreateModal(true);
        }}
      />
      {openCreateModal && (
        <CreateUserModal
          isOpen={openCreateModal}
          onClose={() => {
            fetchAllUsers();
            setOpenCreateModal(false);
          }}
          user={selectedUser}
        />
      )}

      {openModal && (
        <DeleteModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onDelete={deleteAdminUser}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default UsersTable;
