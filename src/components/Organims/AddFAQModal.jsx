import React, { useState, useEffect } from "react";
import InputBox from "../atoms/InputBox";
import Dropdown from "../atoms/DropDown";
import PrimaryButton from "../atoms/PrimaryButton";
import Typography from "../atoms/Typography";
import { createFAQ, updateFAQ } from "../../APIs/faq.services";
import { toast } from "react-toastify";
import Modal from "../Molecule/Modal";

const relatedTopics = [
  { value: "SAP", label: "SAP Training" },
  { value: "CLOUD_TECHNOLOGIES", label: "Cloud Technologies" },
  { value: "DATA_ANALYTICS", label: "Data Analytics Certification" },
  { value: "AI&ML", label: "AI and Machine Learning" },
  { value: "CYBER_SECURITY", label: "Cyber Security" },
];

const AddFAQModal = ({ isOpen, onClose, faqData = null }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [relatedTopic, setRelatedTopic] = useState("SAP");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false); // To track changes

  // Set initial values if faqData is provided (for edit mode)
  useEffect(() => {
    if (faqData) {
      setQuestion(faqData.question || "");
      setAnswer(faqData.answer || "");
      setRelatedTopic(faqData.related_topic || "SAP");
    }
  }, [faqData]);

  useEffect(() => {
    // Check if any field has changed to enable/disable the submit button
    if (
      faqData &&
      (question !== faqData.question ||
        answer !== faqData.answer ||
        relatedTopic !== faqData.related_topic)
    ) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [question, answer, relatedTopic, faqData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    // Basic validation
    if (!question || !answer) {
      setError("Question and Answer are required");
      setLoading(false);
      return;
    }

    const faqPayload = {
      question,
      answer,
      related_topic: relatedTopic,
      id: faqData?.id, // Add id if in update mode
    };

    try {
      let response;
      if (faqData) {
        // If faqData exists, update the FAQ
        response = await updateFAQ(faqPayload);
      } else {
        // Otherwise, create a new FAQ
        response = await createFAQ(faqPayload);
      }

      if (response?.success) {
        toast.success(response?.data?.message);
        onClose();
      } else {
        toast.error("Error occurred. Try again!");
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast.error("An error occurred while processing your request");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={faqData ? "Edit FAQ" : "Add FAQ"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputBox
          id="question"
          name="question"
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          error={error && !question ? "Question is required" : ""}
        />
        <div>
          <textarea
            id="answer"
            name="answer"
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          {error && !answer && (
            <Typography variant="p" className="text-red-800">
              Answer is required
            </Typography>
          )}
        </div>

        <Dropdown
          id="relatedTopic"
          name="relatedTopic"
          options={relatedTopics}
          value={relatedTopic}
          onChange={(e) => setRelatedTopic(e.target.value)}
        />

        <PrimaryButton
          stretch
          type="submit"
          loading={loading}
          disabled={!isDirty && faqData} // Disable if no changes in update mode
        >
          {faqData ? "Update FAQ" : "Add FAQ"}
        </PrimaryButton>
      </form>
    </Modal>
  );
};

export default AddFAQModal;
