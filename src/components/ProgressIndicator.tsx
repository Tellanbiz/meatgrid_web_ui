import { ProgressSpinner } from "primereact/progressspinner";

interface ProgressIndicatorProps {
  className?: string;
  height?: string;
  width?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  className,
  height = "60px",
  width = "60px",
}) => {
  return <ProgressSpinner style={{ height, width }} className={className} />;
};

export default ProgressIndicator;
