import React, { useState, useEffect } from "react";
import {
  deleteCompany,
  getCompanies,
  saveCompany,
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
    company_name: "",
    company_logo: "",
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
    if (!companyData.company_name.trim()) return;

    setLoading(true);
    try {
      let payload = {
        ...companyData,
        user_email,
        company_logo:
          uploadStates.logo?.uploadedUrl || selectedCompany?.company_logo,
      };

      if (isEditMode) {
        payload.id = selectedCompany?.id;
      }
      const response = await saveCompany(payload);
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
      company_name: company.company_name,
      company_logo: company.company_logo,
    });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const resetForm = () => {
    setCompanyData({ company_name: "", company_logo: "" });
    setSelectedCompany(null);
    setIsEditMode(false);
  };

  const isDisabled =
    isEditMode &&
    selectedCompany &&
    companyData.company_name === selectedCompany.company_name;

  const headers = ["ID", "Name", "Logo", "User email", "Created At"];

  const fomattedData = companies.map((company, index) => ({
    id: company.id || index,
    company_name: company.company_name || "",
    company_logo: company.company_logo || "",
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
            setModalOpen(true);
            setSelectedCompany(row);
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
            id="company_name"
            name="company_name"
            label="Company Name"
            placeholder="Enter company name"
            value={
              selectedCompany
                ? selectedCompany?.company_name
                : companyData.company_name
            }
            onChange={(e) =>
              setCompanyData({ ...companyData, company_name: e.target.value })
            }
          />

          <div>
            <Typography variant="h3" className="mb-2">
              Company Logo
            </Typography>
            <UploadButton fieldId="logo" showImage={true} />
            {selectedCompany && selectedCompany.company_logo && (
              <img
                src={selectedCompany.company_logo}
                alt="Company Logo"
                className="w-40 h-40 mt-2"
              />
            )}
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
