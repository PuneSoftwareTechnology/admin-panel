import React, { useEffect, useState } from "react";
import Loader from "../atoms/Loader";
import Typography from "../atoms/Typography";
import { fetchAllSyllabus } from "../../APIs/syllabus.services";
import TableView from "../Organims/TableView";

const Syllabus = () => {
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState([]);

  const fetchSyllabusAPICall = async () => {
    setLoading(true);
    try {
      const response = await fetchAllSyllabus();
      if (response?.success && Array.isArray(response?.data)) {
        setSyllabus(response.data);
      } else {
        setSyllabus([]);
      }
    } catch (error) {
      setSyllabus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabusAPICall();
  }, []);

  const headers = ["ID", "Course ID", "Module Name", "Lessons", "User Email"];

  const formattedSyllabus = syllabus.map((item, index) => ({
    id: item?.id || index,
    course_id: item?.course_id || "",
    module_name: item?.module_name || "",
    lessons: JSON.parse(item?.lessons).join(",") || "",
    user_email: item?.user_email || "",
  }));

  const columnStyleMap = {
    Lessons: ({ value }) => (
      <div>
        {value.split(",").map((lesson, idx) => (
          <Typography key={idx} variant="body1">
            ✅ {lesson}
          </Typography>
        ))}
      </div>
    ),
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-4">
        <Typography variant="h3">Syllabus</Typography>
      </div>
      {loading ? (
        <Loader className="mx-auto mt-32 border-gray-900" size="large" />
      ) : (
        <TableView
          data={formattedSyllabus}
          headers={headers}
          columnStyleMap={columnStyleMap}
        />
      )}
    </div>
  );
};

export default Syllabus;
