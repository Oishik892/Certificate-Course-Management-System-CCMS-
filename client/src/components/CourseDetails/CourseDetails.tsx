import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Payment from "../Payment/Payment";

export interface Course {
  courseid: string; //could be number
  coursename: string;
  level: string;
  instructor: string;
  ects: number;
  startdate: string;
  enddate: string;
}

interface CourseDetailsProps {
  userRole?: string | null | undefined;
  course: Course;
  // teacherName?: string | null | undefined;
  teacherid?: string | null | undefined; //might be number
  studentid?: string | null | undefined; //might be number
  isEnrolled?: string | null | undefined; //might be number
  isAssigned?: string | null | undefined; //might be number
  instructors: {
    teacherid: string;
    teacherfirstname: string;
    teacherlastname: string;
  }[];
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  userRole = "",
  course,
  // teacherName = "",
  teacherid = "", //might be number'
  studentid = "", //might be number
  instructors = [],
  isEnrolled = "false",
  isAssigned = "false",
}) => {
  const navigate = useNavigate();
  function onBackClick(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    navigate(`/student-dashboard/${studentid}`);
  }

  const [showGetPayPopup, setShowGetPayPopup] = useState(false);
  const handlePostAttendance = () => {
    const confirmed = window.confirm(
      "Are you sure you want to post attendance?"
    );

    if (confirmed) {
      const postData = {
        teacherid: teacherid,
        courseid: course.courseid,
        sessiondate: new Date().toISOString().split("T")[0],
      };
      console.log(postData);
      // Make the API call using Axios
      axios
        .post("http://localhost:5000/postAttendance", postData) // Replace with your actual API endpoint
        .then((response) => {
          if (response.status === 201) {
            alert("Attendance successfully posted!");
          } else {
            alert("Error posting attendance. Please try again later.");
          }
        })
        .catch((error) => {
          console.error("Error posting attendance:", error);
        });
    }
  };
  const handleGetPay = () => {
    setShowGetPayPopup(true);
  };
  // userRole = "teacher";
  const handleEnroll = async () => {
    try {
      console.log(studentid);
      console.log(course.courseid);

      // If user is not logged in, redirect to signup page
      // Replace '/signup' with the actual signup page route
      if (userRole !== "teacher" && userRole !== "student") {
        window.location.href = "/signup";
      } else {
        const response = await axios.post(
          "http://localhost:5000/enroll-course",
          {
            courseid: course.courseid,
            studentid: studentid,
          }
        );
        // Check if the enrollment was successful
        if (response.status === 201) {
          alert("Enrollment Successful!");
        } else {
          alert("Enrollment Failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error enrolling in the course:", error);
      alert("Enrollment Failed. Please try again.");
    }
  };

  const handleClosePopup = () => {
    setShowGetPayPopup(false);
  };

  function formatDate(dateString: string) {
    // const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  // userRole = "teacher"
  return (
    <div className="container-fluid flex-fill py-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-7">
          {/* {userRole} (Temporarily showing user role ) */}
          {/* {isEnrolled} */}
          <div className="card shadow w-100 mx-auto">
            <div className="card-body">
              <h2 className="card-title">{course.coursename}</h2>
              <p>
                <strong>Level:</strong>{" "}
                {course.level === "beginner"
                  ? "Beginner"
                  : course.level === "intermediate"
                  ? "Intermediate"
                  : course.level === "advanced"
                  ? "Advanced"
                  : ""}
              </p>
              <p>
                <strong>Instructor(s):</strong>
              </p>{" "}
              <ul>
                {instructors.map((instructor, index) => (
                  <li key={index}>
                    {instructor.teacherfirstname} {instructor.teacherlastname}
                  </li>
                ))}
              </ul>
              <p>
                <strong>ECTS:</strong> {course.ects}
              </p>
              <p>
                <strong>Start Date:</strong> {formatDate(course.startdate)}
              </p>
              <p>
                <strong>End Date:</strong> {formatDate(course.enddate)}
              </p>
              {userRole === "teacher" && isAssigned === "true" ? (
                <div>
                  <button className="btn btn-primary" onClick={handleGetPay}>
                    Get Pay
                  </button>
                  <br />
                  <button
                    className="btn btn-success"
                    onClick={handlePostAttendance}
                  >
                    Post Attendance
                  </button>
                </div>
              ) : userRole === "student" && isEnrolled === "false" ? (
                <button className="btn btn-primary" onClick={handleEnroll}>
                  Enroll Now
                </button>
              ) : userRole !== "teacher" && isEnrolled === "false" ? (
                <div>
                  <button className="btn btn-primary" onClick={handleEnroll}>
                    Enroll Now
                  </button>
                  <br />
                  {/* <button className="btn btn-secondary" onClick={onBackClick}>
                    Back
                  </button> */}
                </div>
              ) : null}
              {userRole === "student" && isEnrolled === "true" ? (
                <div>
                  {/* <br /> */}
                  <Link to={`/certificate/${studentid}/${course.courseid}`}>
                    <button className="btn btn-success">Get certificate</button>
                  </Link>
                  {/* <button
                    className="btn btn-secondary"
                    onClick={onBackClick}
                    style={{ marginLeft: "10px" }}
                  >
                    Back
                  </button> */}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/* Get Pay Popup */}
      {showGetPayPopup && (
        <div className="popup d-flex flex-column align-items-center ">
          <Payment
            course={course} //do i need curly braces?
            teacherid={teacherid} //do i need curly braces?
          ></Payment>
          <button onClick={handleClosePopup} className="btn btn-success mt-3">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
