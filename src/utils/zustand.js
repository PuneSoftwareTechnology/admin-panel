import { create } from "zustand";

const useStore = create((set) => ({
  isAuthenticated: false,
  jwtToken: "",
  activeTab: "/admin/dashboard",
  userRole: "",
  email: "",
  name: "",
  courseNames: [],
  categories: [],
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setJwtToken: (token) => set({ jwtToken: token }),
  setRole: (role) => set({ userRole: role }),
  setEmail: (email) => set({ email }),
  setName: (name) => set({ name }),
  setCourses: (courses) => set({ courseNames: courses }),
  setCategories: (categories) => set({ categories }),
}));

// Persist the state to localStorage when it changes
if (typeof window !== "undefined") {
  const savedState = localStorage.getItem("zustandStore");
  if (savedState) {
    try {
      useStore.setState(JSON.parse(savedState));
    } catch (e) {
      console.error("Failed to load saved state:", e);
    }
  }

  // Subscribe to state changes and persist them in localStorage
  useStore.subscribe((newState) => {
    try {
      localStorage.setItem("zustandStore", JSON.stringify(newState));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  });
}

export default useStore;
