import { useEffect } from "react";
import Typography from "../atoms/Typography";
import { MdCancel } from "react-icons/md";

const Modal = ({ isOpen, onClose, title, children, width = "max-w-md" }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target.id === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start pt-8 justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-[90%] ${width}  relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <MdCancel
          className="absolute top-3 right-5 text-xl font-bold text-gray-600 hover:text-gray-900"
          onClick={onClose}
          size={28}
        />
        {title && (
          <Typography variant="h3" className=" mb-2">
            {title}
          </Typography>
        )}

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
