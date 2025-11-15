"use client";

import { X } from "lucide-react";
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ModelContext = createContext();
function Model({ children }) {
  const [open, setOpen] = useState("");
  const openModal = (name) => setOpen(name);
  const closeModal = () => setOpen("");
  return (
    <ModelContext.Provider value={{ open, openModal, closeModal }}>
      {children}
    </ModelContext.Provider>
  );
}

function Open({ children, name }) {
  const { open, openModal, closeModal } = useContext(ModelContext);

  return <>{cloneElement(children, { onClick: () => openModal(name) })}</>;
}
function Window({ children, openName }) {
  const { open, closeModal } = useContext(ModelContext);
  if (open !== openName) return null;
  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#10131D1A] backdrop-blur-sm">
      <div>{cloneElement(children, { onClose: () => closeModal() })}</div>
    </div>,
    document.body
  );
}

Model.Open = Open;
Model.Window = Window;
export default Model;
