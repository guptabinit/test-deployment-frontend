"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
