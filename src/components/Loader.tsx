interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

const Loader = ({
  size = 42,
  color = "border-gray-500",
  className = "",
}: LoaderProps) => {
  const spinnerSize = `${size}px`;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: spinnerSize, height: spinnerSize }}
    >
      <div
        className={`border-2 border-t-transparent ${color} rounded-full animate-spin`}
        style={{ width: spinnerSize, height: spinnerSize }}
      />
    </div>
  );
};

export default Loader;
