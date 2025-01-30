import PrimaryButton from "../atoms/PrimaryButton";
import SecondaryButton from "../atoms/SecondaryButton";
import Typography from "../atoms/Typography";
import Modal from "../Molecule/Modal";

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <Typography variant="body1" className="text-gray-700">
        Are you sure you want to delete this item?
      </Typography>
      <div className="flex justify-end gap-4 mt-6">
        <SecondaryButton onClick={onClose} color="gray">
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={onDelete} className="bg-red-700">
          Delete
        </PrimaryButton>
      </div>
    </Modal>
  );
};
export default DeleteModal;
