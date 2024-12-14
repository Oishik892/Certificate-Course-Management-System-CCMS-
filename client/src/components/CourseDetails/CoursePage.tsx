import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar_temp from "../Navbar_temp";
import CourseDetails, { Course } from "./CourseDetails";

const CoursePage = () => {
  const { courseid } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Already defined parameters
  const studentid = searchParams.get("studentid");
  const isEnrolled = searchParams.get("isEnrolled");
  const isAssigned = searchParams.get("isAssigned");

  // Additional parameters
  const userRole = searchParams.get("userRole");
  // const teachername = searchParams.get("teachername");
  const teacherid = searchParams.get("teacherid");

  // const [userExists, setUserExists] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<boolean>(
    userRole === "teacher" || userRole === "student" || userRole === "admin"
  );

  const [course, setCourse] = useState<Course | null>(null); // Initialize course as null
  // const [instructors, setInstructors] = useState<string[]>([]); // State to store instructors
  const [instructors, setInstructors] = useState<
    {
      teacherid: string;
      teacherfirstname: string;
      teacherlastname: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchCourseAndInstructors = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/courses/${courseid}` // Fetch course details & instructors
        );

        setCourse(response.data);
        setInstructors(response.data.teachers);
      } catch (error) {
        console.error("Error fetching course and instructors:", error);
      }
    };

    fetchCourseAndInstructors();
  }, [courseid]);

  console.log(course);

  return (
    <div
      className="container-fluid py-5 flex-fill"
      style={{
        backgroundImage: `url('bg_8(1).jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar_temp userExists={userExists} />
      {/* <Navbar isLoggedIn={true} onLogout={() => {}} /> */}
      <div
        className="row flex-fill"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1",
        }}
      >
        <div className="flex-fill" style={{}}>
          {/* userRole  = {userRole}
           <br />
          isEnrolled = {isEnrolled}
          <br />
          isAssigned = {isAssigned} */}
          {/* studentid = {studentid} */}
          {/* Render CourseDetails only when course data is available */}

          {course && (
            <CourseDetails
              course={course} //curly braces are necessary or not?
              // teacherName={teachername} //curly braces are necessary or not?
              teacherid={teacherid} //curly braces are necessary or not?
              studentid={studentid}
              userRole={userRole}
              instructors={instructors}
              isEnrolled={isEnrolled}
              isAssigned={isAssigned}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
