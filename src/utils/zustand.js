import { create } from "zustand";

const useStore = create((set) => ({
  isAuthenticated: false,
  setAuthenticated: (auth) => {
    set({ isAuthenticated: auth });
  },
  activeTab: "/admin/dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),
  jwtToken: "",
  setJwtToken: (token) => set({ jwtToken: token }),
}));

// Persist the state to localStorage when it changes
if (typeof window !== "undefined") {
  const savedState = localStorage.getItem("zustandStore");
  if (savedState) {
    useStore.setState(JSON.parse(savedState));
  }

  useStore.subscribe((newState) => {
    localStorage.setItem("zustandStore", JSON.stringify(newState));
  });
}

export default useStore;
