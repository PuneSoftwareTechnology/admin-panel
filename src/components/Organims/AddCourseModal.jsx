import React, { useState, useEffect } from "react";
import Typography from "../atoms/Typography";
import Modal from "../Molecule/Modal";
import useFileUpload from "../../hooks/useUploadFile";
import PrimaryButton from "../atoms/PrimaryButton";
import BulletPointsInput from "../Molecule/BulletPointsInput";
import useBulletPoints from "../../hooks/useBulletPoints";
import ToggleSwitch from "../atoms/ToggleSwitch";
import { createCourse, updateCourse } from "../../APIs/courses.services";
import Dropdown from "../atoms/DropDown";
import useStore from "../../utils/zustand";
import { toast } from "react-toastify";
import { GiCancel } from "react-icons/gi";

const AddCourseModal = ({ isOpen, onClose, courseData }) => {
  const user_email = useStore((state) => state.email);
  const courses = useStore((state) => state.courseNames);
  const categories = useStore((state) => state?.categories);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState(courses);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [moduleHeading, setModuleHeading] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState();
  const [trainingProcedure, setTrainingProcedure] = useState(false);
  const [metaDesc, setMetaDesc] = useState(courseData?.meta_desc || "");
  const {
    points: intro,
    addPoint: addIntro,
    removePoint: removeIntro,
  } = useBulletPoints(courseData?.intro);
  const {
    points: modules,
    addPoint: addModule,
    removePoint: removeModule,
  } = useBulletPoints(courseData?.modules);
  const {
    points: prerequisites,
    addPoint: addPrerequisite,
    removePoint: removePrerequisite,
  } = useBulletPoints(courseData?.prerequisite);
  const { UploadButton, uploadStates } = useFileUpload();

  useEffect(() => {
    if (courseData) {
      setName(courseData.name || "");
      setDescription(courseData.description || "");
      setModuleHeading(courseData.module_heading || "");
      setSlug(courseData.slug || "");
      setCategory(courseData.category_id || "");
      setTrainingProcedure(courseData.training_procedure || false);
      setRelatedCourses(courseData?.related_courses || []);
      setAvailableCourses(
        courses.filter(
          (course) => !courseData.related_courses.includes(course.id)
        )
      );
    } else {
      setAvailableCourses(courses);
    }
  }, [courseData, courses]);

  const handleSave = async () => {
    setLoading(true);
    const course = {
      name,
      intro,
      description,
      module_heading: moduleHeading,
      modules,
      prerequisite: prerequisites,
      related_courses: relatedCourses,
      slug,
      category_id: category,
      training_procedure: trainingProcedure,
      featured_image:
        uploadStates.courseImage?.uploadedUrl || courseData?.featured_image,
      meta_desc: metaDesc,
      user_email,
    };

    try {
      let response;
      if (courseData) {
        response = await updateCourse({ ...course, id: courseData?.id });
      } else {
        response = await createCourse(course);
      }

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error("Failed to save course.");
      }
    } catch (error) {
      toast.error("An error occurred while saving the course.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleRelatedCoursesChange = (event) => {
    const selectedCourseId = event.target.value;

    const selectedCourse = availableCourses.find(
      (course) => course.id === selectedCourseId
    );

    if (selectedCourse) {
      setRelatedCourses([...relatedCourses, selectedCourse.id]);
      setAvailableCourses((prev) =>
        prev.filter((course) => course.id !== selectedCourseId)
      );
    }
  };

  const handleRemoveRelatedCourse = (index) => {
    const courseToRemoveId = relatedCourses[index];

    setRelatedCourses((prev) => prev.filter((_, i) => i !== index)); // Remove from relatedCourses
    setAvailableCourses((prev) => [
      ...prev,
      courses.find((course) => course.id === courseToRemoveId),
    ]); // Add back to availableCourses
  };

  const inputFields = [
    { label: "Course Name", value: name, onChange: setName, type: "text" },
    {
      label: "Description",
      value: description,
      onChange: setDescription,
      type: "textarea",
    },
    {
      value: metaDesc,
      onChange: setMetaDesc,
      label: "Meta Description",
      type: "textarea",
    },
    {
      label: "Module Heading",
      value: moduleHeading,
      onChange: setModuleHeading,
      type: "text",
    },
    { label: "Slug", value: slug, onChange: setSlug, type: "text" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="w-1/2"
      title={courseData ? "Edit Course" : "Add New Course"}
    >
      <div className="p-4">
        <form>
          {inputFields.map((field, index) => (
            <div className="mb-4" key={index}>
              <Typography variant="h5" className="block text-gray-700">
                {field.label}
              </Typography>
              {field.type === "textarea" ? (
                <textarea
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              ) : (
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              )}
            </div>
          ))}
          <div className="mb-4">
            <Typography variant="h5" className="block text-gray-700">
              Category
            </Typography>
            <Dropdown
              id="category"
              name="category"
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <ToggleSwitch
              id="trainingProcedure"
              checked={trainingProcedure}
              onChange={(e) => setTrainingProcedure(e.target.checked)}
              label="Training Procedure"
            />
          </div>
          <Typography variant="h5" className="block text-gray-700">
            Course Intro
          </Typography>
          <BulletPointsInput
            points={intro}
            onAddPoint={addIntro}
            onRemovePoint={removeIntro}
          />
          <div className="mb-4">
            <Typography variant="h5" className="block text-gray-700">
              Modules
            </Typography>
            <BulletPointsInput
              points={modules}
              onAddPoint={addModule}
              onRemovePoint={removeModule}
            />
          </div>
          <div className="mb-4">
            <Typography variant="h5" className="block text-gray-700">
              Prerequisite
            </Typography>
            <BulletPointsInput
              points={prerequisites}
              onAddPoint={addPrerequisite}
              onRemovePoint={removePrerequisite}
            />
          </div>
          <div className="mb-4">
            <Typography variant="h5" className="block text-gray-700">
              Related Courses
            </Typography>
            <Dropdown
              id="relatedCourses"
              name="relatedCourses"
              options={availableCourses.map((course) => ({
                value: course.id,
                label: course.name,
              }))}
              value=""
              onChange={handleRelatedCoursesChange}
              isMulti
            />
            <ul className="mt-2 flex justify-start items-center gap-2">
              {relatedCourses?.map((courseId, index) => (
                <li
                  key={index}
                  className="flex w-fit items-center justify-between p-2 bg-gray-200 gap-x-2 rounded-md"
                >
                  <span>
                    {courses.find((course) => course?.id === courseId)?.name ||
                      ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRelatedCourse(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <GiCancel />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <Typography variant="h5" className="block text-gray-700">
              Featured Image
            </Typography>
            <UploadButton
              existingImageUrl={courseData?.featured_image}
              fieldId="courseImage"
            />
          </div>
          <div className="flex justify-end">
            <PrimaryButton
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              type="button"
              loading={loading}
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </PrimaryButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddCourseModal;
