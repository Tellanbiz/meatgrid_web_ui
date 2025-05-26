import { useState } from "react";

export const useModal = () => {
  const [isOpen, _setIsOpen] = useState(false);

  const setIsOpen = async (state: boolean) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 0);
    });
    _setIsOpen(state);
  };

  return [isOpen, setIsOpen] as const;
};
