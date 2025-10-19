import { useState, useEffect, createContext, useContext } from "react";

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children, role, navItems }) => {
  const [selected, setSelected] = useState(navItems[0]?.key);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (navItems.length > 0) {
      setSelected(navItems[0].key);
    }
  }, [role, navItems]);

  useEffect(() => {
    if (navItems.length > 0 && !selected) {
      setSelected(navItems[0].key);
    }
  }, [navItems, selected]);

  const value = {
    role,
    navItems,
    selected,
    setSelected,
    showLogout,
    setShowLogout,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
};
