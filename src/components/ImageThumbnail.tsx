import { X } from "lucide-react";

interface Props {
  src: string;
  onRemove: () => void;
  className?: string;
}

const ImageThumbnail = ({ src, onRemove, className }: Props) => {
  return (
    <div
      className={`relative w-full h-32 rounded border overflow-hidden group shadow-sm ${className}`}
    >
      <img src={src} alt="Uploaded" className="w-full h-full object-cover" />
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow group-hover:visible invisible"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ImageThumbnail;
