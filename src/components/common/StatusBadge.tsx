interface StatusBadgeProps {
  text: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  text,
  className = "bg-gray-500 text-white",
}) => {
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${className}`}>
      {text}
    </span>
  );
};

export default StatusBadge;
