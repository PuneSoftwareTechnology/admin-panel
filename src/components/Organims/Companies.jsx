import React, { useState, useEffect } from "react";
import {
  deleteCompany,
  getCompanies,
  saveCompany,
  updateCompany,
} from "../../APIs/misc.services";
import Typography from "../atoms/Typography";
import TableView from "../Organims/TableView";
import PrimaryButton from "../atoms/PrimaryButton";
import Loader from "../atoms/Loader";
import Modal from "../Molecule/Modal";
import InputBox from "../atoms/InputBox";
import { toast } from "react-toastify";
import useStore from "../../utils/zustand";
import useFileUpload from "../../hooks/useUploadFile";
import { IoMdAdd } from "react-icons/io";
import DeleteModal from "./DeleteModal";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const user_email = useStore((state) => state.email);
  const [companyData, setCompanyData] = useState({
    name: "",
    logo_url: "",
  });
  const { UploadButton, uploadStates, clearState } = useFileUpload();

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      if (response?.success) {
        setCompanies(response.data);
      } else {
        setError("Failed to fetch companies");
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("An error occurred while fetching companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSaveCompany = async () => {
    if (!companyData.name.trim()) return;

    setLoading(true);
    try {
      let payload = {
        ...companyData,
        user_email,
        logo_url: uploadStates.logo?.uploadedUrl || selectedCompany?.logo_url,
      };

      if (isEditMode) {
        payload.id = selectedCompany?.id;
      }

      const response = isEditMode
        ? await updateCompany(payload)
        : await saveCompany(payload);
      if (response?.success) {
        setLoading(false);
        setModalOpen(false);
        fetchCompanies();
      }
    } catch (err) {
      console.error("Error saving company:", err);
      toast.error("An error occurred while saving company");
    } finally {
      setLoading(false);
      clearState("logo");
    }
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setCompanyData({
      name: company.name,
      logo_url: company.logo_url,
    });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const resetForm = () => {
    setCompanyData({ name: "", logo_url: "" });
    setSelectedCompany(null);
    setIsEditMode(false);
  };

  const isDisabled =
    isEditMode && selectedCompany && companyData.name === selectedCompany.name;

  const headers = ["ID", "Name", "Logo", "User email", "Created At"];

  const fomattedData = companies.map((company, index) => ({
    id: company.id || index,
    name: company.name || "",
    logo_url: company.logo_url || "",
    user_email: company.user_email || "",
    created_at: company.created_at || "",
  }));

  const deletdCompanyAPICALL = async () => {
    const response = await deleteCompany({ id: selectedCompany.id });
    if (response?.success) {
      setDeleteLoading(false);
      setDeleteModal(false);
      fetchCompanies();
    } else {
      toast.error("An error occurred while deleting company");
    }
  };

  const styledCell = {
    Logo: ({ value }) => (
      <a
        href={value}
        className="text-blue-700 underline"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {value}
      </a>
    ),
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md ">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h2">Companies</Typography>
        <PrimaryButton
          onClick={() => {
            setIsEditMode(false);
            setModalOpen(true);
          }}
        >
          <IoMdAdd size={24} />
          Add New Company
        </PrimaryButton>
      </div>
      {loading ? (
        <Loader
          size="large"
          ariaLabel="Loading companies..."
          className="border-gray-700 mx-auto"
        />
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <TableView
          data={fomattedData}
          headers={headers}
          onRowClick={(row) => {
            handleEditCompany(row);
          }}
          onDelete={(row) => {
            setSelectedCompany(row);
            setDeleteModal(true);
          }}
          columnStyleMap={styledCell}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={isEditMode ? "Edit Company" : "Add New Company"}
      >
        <div className="space-y-4">
          <InputBox
            id="name"
            name="name"
            label="Company Name"
            placeholder="Enter company name"
            value={companyData.name} // Always use companyData.name
            onChange={(e) =>
              setCompanyData({ ...companyData, name: e.target.value })
            }
          />

          <div>
            <Typography variant="h3" className="mb-2">
              Company Logo
            </Typography>
            <UploadButton
              existingImageUrl={selectedCompany?.logo_url}
              fieldId="logo"
              showImage={true}
            />
          </div>
          <div className="flex justify-end">
            <PrimaryButton
              onClick={handleSaveCompany}
              loading={loading}
              disabled={isDisabled}
            >
              {isEditMode ? "Save Changes" : "Add Company"}
            </PrimaryButton>
          </div>
        </div>
      </Modal>
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => {
          fetchCompanies();
          setDeleteModal(false);
        }}
        onDelete={deletdCompanyAPICALL}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Companies;
