import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import certificateTemplate from "./certificate.png";
import "./certificateText.css";

// Define the interface for props
// interface CertificateProps {
//   name: string;
//   course$$?: string;
// }
interface Course {
  coursename: string;
  // Add any other properties that the course object might have
}
interface StudentData {
  studentid: string;
  studentfirstname: string;
  studentlastname: string;
  email: string;
}

// Modify the component to accept props
// const Certificate: React.FC<CertificateProps> = ({ name, course$$ }) => {
const Certificate: React.FC = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [studentid, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUrl = window.location.href; // Get the full URL
    const parts = currentUrl.split("/"); // Split by /
    const studentid = parts[parts.indexOf("certificate") + 1]; // Extract the student ID
    const courseId = parts[parts.length - 1]; // Extract the course ID
    setStudentId(studentid);
    setCourseId(courseId);
  }, []);

  // console.log({ studentid, courseId });

  useEffect(() => {
    const fetchStudentData = async () => {
      if (studentid) {
        console.log("Fetching data for student ID:", studentid); // Log the student ID
        try {
          const response = await axios.get(
            `http://localhost:5000/student/${studentid}`
          );
          console.log("API Response:", response.data); // Log the entire response data

          const data: StudentData = response.data; // Axios automatically parses JSON
          setStudent(data);

          // Log studentfirstname and studentlastname
          console.log("Student First Name:", data.studentfirstname);
          console.log("Student Last Name:", data.studentlastname);
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };

    fetchStudentData();
  }, [studentid]);

  useEffect(() => {
    const fetchCourseData = async () => {
      console.log("course id kita: ", courseId);
      try {
        const response = await axios.get(
          `http://localhost:5000/course/${courseId}`
        );
        setCourse(response.data);
        console.log({ course });
      } catch (err) {
        console.error("Error fetching course data:", err);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const ref = useRef<HTMLAnchorElement>(null);
  // name = 'Sahib Abbas Bahar Chowdhury'
  // course = "Database Management Systems"

  const handlePrint = useCallback(() => {
    e.preventDefault();
    e.stopPropagation();
    if (ref.current === null) {
      return;
    }

    // toPng(ref.current, { cacheBust: true })
    //   .then((dataUrl: string) => {
    //     const link = document.createElement("a");
    //     link.download = "certificate.png";
    //     link.href = dataUrl;
    //     link.click();
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
    ref.current.download = "certificate.png";
    ref.current.click();
  }, [ref]);

  function onBackClick(): void {
    // event: MouseEvent<HTMLButtonElement, MouseEvent>
    navigate(`/student-dashboard/${studentid}`);
  }

  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: `url('bg_8(1).jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: "1",
        paddingTop: "100px",
        paddingBottom: "20px",
        gap: "2rem",
      }}
    >
      <a
        href={certificateTemplate}
        className="certificate_container"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flex: "1",
          alignItems: "center",
          cursor: "pointer",
        }}
        // download={"certificate.png"}
        target="_blank"
        ref={ref}
      >
        {/* <a href="" download="certificate.png" style={{ width: "100%" }} > */}
        <img
          src={certificateTemplate}
          alt="Certificate Template"
          height={500}
          style={{
            width: "auto",
            height: "100%",
            maxWidth: "1440px",
            maxHeight: "808px",
            marginBlock: "auto",
            display: "block",
          }}
        />
        {/* </a> */}
        <div
          className="certificate_content"
          style={{
            position: "absolute",
            top: "48%",
            textDecoration: "none",
            color: "black",
            alignSelf: "center",
          }}
        >
          {/* <h1>{name}</h1> */}
          <p
            className="studentName"
            style={{
              textTransform: "capitalize",
              fontSize: "2rem",
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: "bold",
            }}
          >
            <em
              style={{
                fontFamily: "'Times New Roman', Times, serif",
              }}
            >
              {student?.studentfirstname} {student?.studentlastname}
            </em>
          </p>
        </div>
        <p
          className="coursename"
          style={{
            position: "absolute",
            top: "58%",
            // left: `${50 - (course?.coursename?.length ?? 0) / 2}%`,
            alignSelf: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
            textDecoration: "none",
            fontFamily: "'Times New Roman', Times, serif",
            color: "black",
          }}
        >
          {course?.coursename}
        </p>
      </a>
      <div
        className="certificate_footer"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button
          className="btn btn-success takePicture"
          style={{
            width: "fit-content",
          }}
          onClick={handlePrint}
        >
          Save Certificate
        </button>
        <span> </span>
        <button
          className="btn btn-warning goBack"
          style={{
            width: "fit-content",
          }}
          onClick={onBackClick}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Certificate;
