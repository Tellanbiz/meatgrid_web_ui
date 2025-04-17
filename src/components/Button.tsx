import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  text,
  onClick,
  icon,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-2 font-bold bg-primary text-white rounded hover:bg-blue-800 focus:outline-none transition duration-300 ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 border border-blue-500 font-bold text-blue-500 rounded hover:bg-blue-100 focus:outline-none transition duration-300 ${className}`}
    >
      {text}
    </button>
  );
};

interface IconButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-2 border rounded hover:bg-gray-100 focus:outline-none transition duration-100 ${className}`}
    >
      {icon}
    </button>
  );
};
