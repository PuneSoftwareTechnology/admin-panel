import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import InputBox from "../atoms/InputBox";
import Dropdown from "../atoms/DropDown";
import PrimaryButton from "../atoms/PrimaryButton";
import { createSyllabus, updateSyllabus } from "../../APIs/syllabus.services";
import useStore from "../../utils/zustand";
import SecondaryButton from "../atoms/SecondaryButton";
import Typography from "../atoms/Typography";
import BulletPointsInput from "./BulletPointsInput";
import { MdAdd } from "react-icons/md";

const AddSyllabusModal = ({ isOpen, onClose, syllabus }) => {
  const courses = useStore((state) => state.courseNames);
  const user_email = useStore((state) => state.email);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    if (syllabus) {
      setCourseId(syllabus?.course_id);
      setModules(syllabus.courses_syllabus || []);
    }
  }, [syllabus]);

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const handleAddModule = () => {
    setModules([...modules, { module_name: "", lessons: [] }]);
  };

  const handleRemoveModule = (index) => {
    const updatedModules = modules.filter((_, idx) => idx !== index);
    setModules(updatedModules);
  };

  const handleAddLesson = (moduleIndex, lesson) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push(lesson);
    setModules(updatedModules);
  };

  const handleRemoveLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons = updatedModules[
      moduleIndex
    ].lessons.filter((_, idx) => idx !== lessonIndex);
    setModules(updatedModules);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      course_id: courseId,
      user_email,
      courses_syllabus: modules,
    };

    try {
      if (syllabus) {
        await updateSyllabus({ id: syllabus.id, ...payload });
      } else {
        await createSyllabus(payload);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save syllabus:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={syllabus ? "Edit Syllabus course" : "Add Syllabus Course"}
      width="w-1/2"
    >
      <div className="space-y-4">
        <Typography variant="h5">Course</Typography>
        <Dropdown
          id="course_id"
          name="course_id"
          options={courses.map((course) => ({
            value: course.id,
            label: course.name,
          }))}
          value={courseId || "0"}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />
        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="space-y-2 ">
            <Typography variant="h5">Module</Typography>
            <InputBox
              id={`module_name_${moduleIndex}`}
              name={`module_name_${moduleIndex}`}
              type="text"
              placeholder="Module Name"
              value={module.module_name}
              onChange={(e) =>
                handleModuleChange(moduleIndex, "module_name", e.target.value)
              }
              required
            />
            <div className="bg-slate-300 p-2 rounded-md">
              <Typography variant="h5">Lessons</Typography>
              <BulletPointsInput
                points={module.lessons}
                onAddPoint={(lesson) => handleAddLesson(moduleIndex, lesson)}
                onRemovePoint={(lessonIndex) =>
                  handleRemoveLesson(moduleIndex, lessonIndex)
                }
              />
            </div>
            <div className="flex justify-start items-center gap-x-4 mt-4">
              <SecondaryButton onClick={() => handleRemoveModule(moduleIndex)}>
                Remove Module
              </SecondaryButton>
            </div>
          </div>
        ))}
        <PrimaryButton onClick={handleAddModule}>
          <MdAdd size={24} /> Add Module
        </PrimaryButton>
        <div className="flex justify-end gap-x-2">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton loading={loading} onClick={handleSubmit}>
            {syllabus ? "Edit" : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default AddSyllabusModal;
