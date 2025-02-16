import React, { useState, useEffect } from "react";
import InputBox from "../atoms/InputBox";
import Dropdown from "../atoms/DropDown";
import PrimaryButton from "../atoms/PrimaryButton";
import Typography from "../atoms/Typography";
import { createFAQ, updateFAQ } from "../../APIs/faq.services";
import { toast } from "react-toastify";
import Modal from "../Molecule/Modal";
import useStore from "../../utils/zustand";

const AddFAQModal = ({ isOpen, onClose, faqData = null }) => {
  const email = useStore((state) => state.email);
  const courses = useStore((state) => state.courseNames);
  const categories = useStore((state) => state.categories);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [courseId, setCourseId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const courseOptions = courses.map((course) => ({
    value: course?.id,
    label: course?.name,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category?.id,
    label: category?.name,
  }));

  useEffect(() => {
    if (faqData) {
      setQuestion(faqData.question || "");
      setAnswer(faqData.answer || "");
      setCourseId(faqData.course_id || "");
      setCategoryId(faqData.category_id || "");
    }
  }, [faqData]);

  useEffect(() => {
    if (
      faqData &&
      (question !== faqData.question ||
        answer !== faqData.answer ||
        courseId !== faqData.course_id ||
        categoryId !== faqData.category_id)
    ) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [question, answer, courseId, categoryId, faqData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    // Basic validation
    if (!question || !answer || !courseId || !categoryId) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const faqPayload = {
      question,
      answer,
      course_id: courseId,
      category_id: categoryId,
      user_email: email,
      id: faqData?.id,
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
          id="course"
          name="course_id"
          options={courseOptions}
          value={courseId} // Set to current state
          onChange={(e) => setCourseId(e.target.value)}
        />

        <Dropdown
          id="category"
          name="category_id"
          options={categoryOptions}
          value={categoryId} // Set to current state
          onChange={(e) => setCategoryId(e.target.value)}
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
