import SecondaryButton from "../atoms/SecondaryButton";
import PrimaryButton from "../atoms/PrimaryButton";
import Modal from "../Molecule/Modal";
import Typography from "../atoms/Typography";

const LogoutModal = ({ isOpen, onClose, handleLogout }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log out confirmation">
      <Typography variant="body1" className="text-gray-700">
        Are you sure you want to log out?
      </Typography>
      <div className="flex justify-end gap-4 mt-6">
        <SecondaryButton onClick={onClose} color="gray">
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={handleLogout} color="red">
          Logout
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default LogoutModal;
