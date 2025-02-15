import { apiRequest } from "./apiCall";

export const fetchAllTestimonials = async () => {
  return await apiRequest(
    "GET",
    "/testimonial/all",
    null,
    "Failed to fetch testimonials",
    true
  );
};

export const deleteTestimonial = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/testimonial/delete",
    payload,
    "Failed to Delete",
    true
  );
};

export const updateTestimonial = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/testimonial/update",
    payload,
    "Failed to Delete",
    true
  );
};
