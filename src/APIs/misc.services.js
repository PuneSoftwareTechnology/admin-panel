import { apiRequest } from "./apiCall";

export const saveCompany = async (payload) => {
  return await apiRequest(
    "POST",
    "/companies/save",
    payload,
    "Failed to save company",
    true
  );
};

export const getCompanies = async () => {
  return await apiRequest(
    "GET",
    "/companies/all",
    null,
    "Failed to fetch companies",
    true
  );
};

export const deleteCompany = async (payload) => {
  return await apiRequest(
    "PATCH",
    `/companies/delete`,
    payload,
    "Failed to delete company",
    true
  );
};

export const updateCompany = async (payload) => {
  return await apiRequest(
    "PATCH",
    `/companies/update`,
    payload,
    "Failed to update company",
    true
  );
};
