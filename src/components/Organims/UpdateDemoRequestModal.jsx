import React, { useEffect, useState } from "react";
import Modal from "../Molecule/Modal";
import Typography from "../atoms/Typography";
import InputBox from "../atoms/InputBox";
import PrimaryButton from "../atoms/PrimaryButton";
import SecondaryButton from "../atoms/SecondaryButton";
import useStore from "../../utils/zustand";
import { updateDemo } from "../../APIs/demos.services";

const UpdateDemoRequestModal = ({ isOpen, onClose, demoRequest }) => {
  const user_email = useStore((state) => state.email);
  const [comment, setComment] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setComment(demoRequest?.comment);
    setNextStep(demoRequest?.next_step);
  }, [demoRequest]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      id: demoRequest?.id,
      user_email,
      comment,
      next_step: nextStep,
    };
    try {
      await updateDemo(payload);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Demo Request">
      <div className="space-y-4">
        <div>
          <Typography variant="body1">Comment</Typography>
          <textarea
            id="comment"
            name="comment"
            placeholder="Enter your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>
        <div>
          <Typography variant="body1">Next Step</Typography>
          <InputBox
            id="nextStep"
            name="nextStep"
            type="text"
            placeholder="Enter next step"
            value={nextStep}
            onChange={(e) => setNextStep(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <SecondaryButton
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleUpdate} loading={loading}>
            Update
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateDemoRequestModal;
