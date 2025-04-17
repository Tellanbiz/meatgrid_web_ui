import React from "react";

type DividerProps = {
  className?: string;
};

const Divider: React.FC<DividerProps> = ({ className }) => {
  return <div className={`h-px w-full bg-gray-200 ${className}`} />;
};

export default Divider;
