import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    setIsOpen(true);
  };

  const closeModal = async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    setIsOpen(false);
  };

  return { isOpen, openModal, closeModal };
};
