import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../pages/style.css";
import Charts from "./Charts/Charts";
import Navbar_temp from "./Navbar_temp";
import { TeacherProps } from "./TeachersList";
interface Course {
  courseid: number;
  coursename: string;
  level: string;
  startDate: Date;
  endDate: Date;
  teachers: string[];
  enrolled: boolean;
}

// interface TeacherProps {
//   teacherfirstname: string | number | readonly string[] | undefined;
//   teacherlastname: string | number | readonly string[] | undefined;
//   email: string | null | undefined;
//   designation: string | null | undefined;
// }

const AdminDashboard: React.FC = () => {
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [unassignedCourses, setUnassignedCourses] = useState<Course[]>([]);
  const [popupOpen, setPopupOpen] = useState(false); // State to track whether the popup is open
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // State to track the course for which teachers are being assigned
  const [teachers, setTeachers] = useState<TeacherProps[]>([]);

  useEffect(() => {
    // Fetch assigned courses from the database or API
    // Replace the axios.get call with the actual endpoint for fetching assigned courses
    axios
      .get<Course[]>("http://localhost:5000/assigned-courses")
      .then((response) => {
        setAssignedCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching assigned courses:", error);
      });

    // Fetch unassigned courses from the database or API
    // Replace the axios.get call with the actual endpoint for fetching unassigned courses
    axios
      .get<Course[]>("http://localhost:5000/unassigned-courses")
      .then((response) => {
        setUnassignedCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching unassigned courses:", error);
      });

    // Fetch teachers from the database or API
    // Replace the axios.get call with the actual endpoint for fetching teachers
    axios
      .get<TeacherProps[]>("http://localhost:5000/teachers")
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  }, []);

  const assignTeachers = (selectedTeachers: string[]) => {
    if (selectedCourse) {
      const updatedCourse = {
        ...selectedCourse,
      };
      const assignableCourses = [...assignedCourses, updatedCourse];
      setAssignedCourses(
        Array.from(
          new Set([
            ...assignedCourses.map((course) => course.courseid),
            updatedCourse.courseid,
          ])
        ).map((course) => assignableCourses.find((c) => c.courseid === course)!)
      );
      setUnassignedCourses(
        Array.from(
          new Set(
            unassignedCourses
              .filter((course) => course.courseid !== selectedCourse.courseid)
              .map((c) => c.courseid)
          )
        ).map((course) => unassignedCourses.find((c) => c.courseid === course)!)
      );
      setPopupOpen(false);
    }
  };

  const togglePopup = (course: Course) => {
    setSelectedCourse(course);
    setPopupOpen(!popupOpen);
  };

  const handleAssign = () => {
    // setShowPopup(true);
    const selectedTeachers: string[] = [];
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:checked'
    );
    checkboxes.forEach((checkbox) => {
      selectedTeachers.push(checkbox.getAttribute("data-teacherid")!);
    });
    assignTeachers(Array.from(new Set(selectedTeachers)));
    axios.post("http://localhost:5000/admin/assign-courses", {
      courseId: selectedCourse?.courseid,
      teacherid: selectedTeachers,
    });
  };

  const renderPopup = () => {
    if (!popupOpen || !selectedCourse) return null;
    return (
      <div className="popup">
        <div
          className="popup-content"
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Select Teachers for {selectedCourse.coursename}</h3>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={teacher.teacherid}>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={teacher.teacherfirstname}
                      id={`teacher-${index}`}
                      data-teacherid={teacher.teacherid}
                    />
                  </td>
                  <td>{teacher.teacherfirstname}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "right" }}>
            <button className="btn btn-primary" onClick={handleAssign}>
              Assign
            </button>
            <button
              className="btn btn-secondary ms-2"
              onClick={() => setPopupOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TeacherDetails: React.FC<TeacherProps> = ({
    teacherfirstname,
    teacherlastname,
    email,
    designation,
  }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleAssign = () => {
      setShowPopup(true);
      const selectedTeachers: string[] = [];
      const checkboxes = document.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:checked'
      );
      checkboxes.forEach((checkbox) => {
        selectedTeachers.push(checkbox.value);
      });
      assignTeachers(Array.from(new Set(selectedTeachers)));
    };

    const handleClosePopup = () => {
      setShowPopup(false);
    };

    // Render function to display course lists
  };
  const renderCourseList = (
    title: string,
    courseList: Course[] | undefined, // Update type to include undefined
    isAssigned: boolean
  ) => {
    const handleDelete = (courseId: number, isAssigned: boolean) => {
      if (isAssigned) {
        setAssignedCourses(
          Array.from(
            new Set(
              assignedCourses.filter((course) => course.courseid !== courseId)
            )
          )
        );
        axios.delete(`http://localhost:5000/delete-course/${courseId}`);
      } else {
        setUnassignedCourses(
          Array.from(
            new Set(
              unassignedCourses.filter((course) => course.courseid !== courseId)
            )
          )
        );
        axios.delete(`http://localhost:5000/delete-course/${courseId}`);
      }
    };

    if (!Array.isArray(courseList)) {
      return null; // Return null if courseList is not an array
    }

    return (
      <div
        className="col-md-6"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div className="card mb-4">
          <div
            className="card-body"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h5
              className="card-title mb-3"
              style={{ fontSize: "30px", fontWeight: "normal" }}
            >
              {title}
            </h5>
            <div style={{ flex: 1 }}>
              <ul className="list-group list-group-flush">
                {courseList.map((course) => (
                  <div
                    key={course.courseid}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <Link
                      to={`/course-page/${course.courseid}`}
                      style={{
                        color: "black",
                        textDecoration: "none",
                        fontWeight: "normal",
                      }}
                      className="text-decoration-none fw-normal"
                    >
                      {course.coursename} ({course.level})
                    </Link>
                    <div>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => togglePopup(course)}
                        style={{ backgroundColor: "#005a5a" }}
                      >
                        Assign
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() =>
                          handleDelete(course.courseid, isAssigned)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleCreateCourse = () => {
    // Navigate to the create course page
    // You can replace "/create-course" with the actual route for the create course page
    window.location.href = "/course-create";
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundImage: `url('bg_4.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar_temp userExists={true} />
      <Charts></Charts>
      <br />
      <div className="row justify-content-center align-items-center">
        <div className="col-md-10">
          <div
            className="card shadow w-100 mx-auto"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: "5px",
            }}
          >
            <div className="card-body">
              <h2 className="card-title mb-4 text-center">Courses</h2>
              {/* Button to navigate to the create course page */}
              <div className="text-center mb-4">
                <button
                  className="btn btn-primary"
                  onClick={handleCreateCourse}
                >
                  Create A Course
                </button>
              </div>
              <div className="column gap-3">
                {renderCourseList("Assigned Courses", assignedCourses, true)}
                {renderCourseList(
                  "Unassigned Courses",
                  unassignedCourses,
                  false
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderPopup()}
    </div>
  );
};
export default AdminDashboard;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "../pages/style.css";
// import Navbar_temp from "./Navbar_temp";

// interface Course {
//   id: number;
//   name: string;
//   level: string;
//   startDate: Date;
//   endDate: Date;
//   teachers: string[];
//   enrolled: boolean;
// }

// const AdminDashboard: React.FC = () => {
//   const [assignedCourses, setAssignedCourses] = useState<Course[]>([
//     {
//       id: 1,
//       name: "English Literature",
//       level: "Intermediate",
//       startDate: new Date(2024, 4, 1),
//       endDate: new Date(2024, 7, 1),
//       teachers: ["John Smith", "Jane Doe"],
//       enrolled: true,
//     },
//     {
//       id: 2,
//       name: "Mathematics",
//       level: "Advanced",
//       startDate: new Date(2024, 4, 1),
//       endDate: new Date(2024, 7, 1),
//       teachers: ["Alice Johnson", "Bob Brown"],
//       enrolled: true,
//     },
//     {
//       id: 3,
//       name: "Physics",
//       level: "Intermediate",
//       startDate: new Date(2024, 4, 1),
//       endDate: new Date(2024, 7, 1),
//       teachers: ["Michael Wilson", "Sarah Adams"],
//       enrolled: true,
//     },
//     {
//       id: 4,
//       name: "Chemistry",
//       level: "Advanced",
//       startDate: new Date(2024, 4, 1),
//       endDate: new Date(2024, 7, 1),
//       teachers: ["David Lee", "Emily Clark"],
//       enrolled: true,
//     },
//   ]);

//   const [unassignedCourses, setUnassignedCourses] = useState<Course[]>([
//     {
//       id: 5,
//       name: "Introduction to Psychology",
//       level: "Intermediate",
//       startDate: new Date(2024, 6, 1),
//       endDate: new Date(2024, 9, 1),
//       teachers: [],
//       enrolled: false,
//     },
//     {
//       id: 6,
//       name: "History of Art",
//       level: "Beginner",
//       startDate: new Date(2024, 6, 1),
//       endDate: new Date(2024, 9, 1),
//       teachers: [],
//       enrolled: false,
//     },
//     {
//       id: 7,
//       name: "CS Fundamentals",
//       level: "Advanced",
//       startDate: new Date(2024, 6, 1),
//       endDate: new Date(2024, 9, 1),
//       teachers: [],
//       enrolled: false,
//     },
//     {
//       id: 8,
//       name: "Digital Marketing Strategies",
//       level: "Intermediate",
//       startDate: new Date(2024, 6, 1),
//       endDate: new Date(2024, 9, 1),
//       teachers: [],
//       enrolled: false,
//     },
//   ]);

//   // const assignedCourses: Course[] = [
//   //   {
//   //     id: 1,
//   //     name: "English Literature",
//   //     level: "Intermediate",
//   //     startDate: new Date(2024, 4, 1),
//   //     endDate: new Date(2024, 7, 1),
//   //     teachers: ["John Smith", "Jane Doe"],
//   //     enrolled: true,
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Mathematics",
//   //     level: "Advanced",
//   //     startDate: new Date(2024, 4, 1),
//   //     endDate: new Date(2024, 7, 1),
//   //     teachers: ["Alice Johnson", "Bob Brown"],
//   //     enrolled: true,
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Physics",
//   //     level: "Intermediate",
//   //     startDate: new Date(2024, 4, 1),
//   //     endDate: new Date(2024, 7, 1),
//   //     teachers: ["Michael Wilson", "Sarah Adams"],
//   //     enrolled: true,
//   //   },
//   //   {
//   //     id: 4,
//   //     name: "Chemistry",
//   //     level: "Advanced",
//   //     startDate: new Date(2024, 4, 1),
//   //     endDate: new Date(2024, 7, 1),
//   //     teachers: ["David Lee", "Emily Clark"],
//   //     enrolled: true,
//   //   },
//   //   // Add more unique assigned courses as needed
//   // ];

//   // const unassignedCourses: Course[] = [
//   //   {
//   //     id: 5,
//   //     name: "Introduction to Psychology",
//   //     level: "Intermediate",
//   //     startDate: new Date(2024, 6, 1),
//   //     endDate: new Date(2024, 9, 1),
//   //     teachers: [],
//   //     enrolled: false,
//   //   },
//   //   {
//   //     id: 6,
//   //     name: "History of Art",
//   //     level: "Beginner",
//   //     startDate: new Date(2024, 6, 1),
//   //     endDate: new Date(2024, 9, 1),
//   //     teachers: [],
//   //     enrolled: false,
//   //   },
//   //   {
//   //     id: 7,
//   //     name: "CS Fundamentals",
//   //     level: "Advanced",
//   //     startDate: new Date(2024, 6, 1),
//   //     endDate: new Date(2024, 9, 1),
//   //     teachers: [],
//   //     enrolled: false,
//   //   },
//   //   {
//   //     id: 8,
//   //     name: "Digital Marketing Strategies",
//   //     level: "Intermediate",
//   //     startDate: new Date(2024, 6, 1),
//   //     endDate: new Date(2024, 9, 1),
//   //     teachers: [],
//   //     enrolled: false,
//   //   },
//   //   // Add more unique unassigned courses as needed
//   // ];

//   // Function to delete a course from the list

//   const [popupOpen, setPopupOpen] = useState(false); // State to track whether the popup is open
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // State to track the course for which teachers are being assigned

//   const assignTeachers = (selectedTeachers: string[]) => {
//     if (selectedCourse) {
//       const updatedCourse = {
//         ...selectedCourse,
//         teachers: selectedTeachers,
//         enrolled: true,
//       };
//       setAssignedCourses([...assignedCourses, updatedCourse]);
//       setUnassignedCourses(
//         unassignedCourses.filter((course) => course.id !== selectedCourse.id)
//       );
//       setPopupOpen(false);
//     }
//   };

//   const togglePopup = (course: Course) => {
//     setSelectedCourse(course);
//     setPopupOpen(!popupOpen);
//   };

//   const dummyTeachers = [
//     { name: "John Smith", email: "john.smith@example.com", designation: "Lecturer" },
//     { name: "Jane Doe", email: "jane.doe@example.com", designation: "Assistant Professor" },
//     { name: "Alice Johnson", email: "alice.johnson@example.com", designation: "Associate Professor" },
//     { name: "Bob Brown", email: "bob.brown@example.com", designation: "Professor" },
//     // Add more teachers with their designations as needed
//   ];

//   const renderPopup = () => {
//     if (!popupOpen || !selectedCourse) return null;
//     return (
//       <div className="popup">
//         <div className="popup-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
//           <h3>Select Teachers for {selectedCourse.name}</h3>
//           <table className="table">
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Designation</th>
//               </tr>
//             </thead>
//             <tbody>
//               {dummyTeachers.map((teacher, index) => (
//                 <tr key={index}>
//                   <td>
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       value={teacher.name}
//                       id={`teacher-${index}`}
//                     />
//                   </td>
//                   <td>{teacher.name}</td>
//                   <td>{teacher.email}</td>
//                   <td>{teacher.designation}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div style={{ textAlign: 'right' }}>
//             <button className="btn btn-primary" onClick={handleAssign}>Assign</button>
//             <button className="btn btn-secondary ms-2" onClick={() => setPopupOpen(false)}>Cancel</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // const renderPopup = () => {
//   //   if (!popupOpen || !selectedCourse) return null;
//   //   return (
//   //     <div className="popup">
//   //       <div
//   //         className="popup-content"
//   //         style={{
//   //           backgroundColor: "#fff",
//   //           padding: "20px",
//   //           borderRadius: "5px",
//   //           boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
//   //         }}
//   //       >
//   //         <h3>Select Teachers for {selectedCourse.name}</h3>
//   //         <table className="table">
//   //           <thead>
//   //             <tr>
//   //               <th></th>
//   //               <th>Name</th>
//   //               <th>Email</th>
//   //               <th>Designation</th>
//   //             </tr>
//   //           </thead>
//   //           <tbody>
//   //             {dummyTeachers.map((teacher, index) => (
//   //               <tr key={index}>
//   //                 <td>
//   //                   <input
//   //                     className="form-check-input"
//   //                     type="checkbox"
//   //                     value={teacher}
//   //                     id={`teacher-${index}`}
//   //                   />
//   //                 </td>
//   //                 <td>{teacher}</td>
//   //                 <td>{`${teacher
//   //                   .toLowerCase()
//   //                   .replace(/\s+/g, ".")}@example.com`}</td>
//   //                 <td>{teacher.designation}</td>
//   //               </tr>
//   //             ))}
//   //           </tbody>
//   //         </table>
//   //         <div style={{ textAlign: "right" }}>
//   //           <button className="btn btn-primary" onClick={() => handleAssign()}>
//   //             Assign
//   //           </button>
//   //           <button
//   //             className="btn btn-secondary ms-2"
//   //             onClick={() => setPopupOpen(false)}
//   //           >
//   //             Cancel
//   //           </button>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // };

//   // const renderPopup = () => {
//   //   if (!popupOpen || !selectedCourse) return null;
//   //   return (
//   //     <div className="popup">
//   //       <div className="popup-content">
//   //         <h3>Select Teachers for {selectedCourse.name}</h3>
//   //         <form onSubmit={handleAssign}>
//   //           {dummyTeachers.map((teacher, index) => (
//   //             <div key={index} className="form-check">
//   //               <input
//   //                 className="form-check-input"
//   //                 type="checkbox"
//   //                 value={teacher}
//   //                 id={`teacher-${index}`}
//   //               />
//   //               <label
//   //                 className="form-check-label"
//   //                 htmlFor={`teacher-${index}`}
//   //               >
//   //                 {teacher}
//   //               </label>
//   //             </div>
//   //           ))}
//   //           <button
//   //             type="submit"
//   //             className="btn btn-primary me-2"
//   //             // style={{ backgroundColor: "#005a5a" }}
//   //           >
//   //             Assign
//   //           </button>
//   //           <button className="btn btn-outline-primary" onClick={() => setPopupOpen(false)}>Cancel</button>
//   //         </form>
//   //       </div>
//   //     </div>
//   //   );
//   // };

//   // const renderPopup = () => {
//   //   if (!popupOpen || !selectedCourse) return null;
//   //   return (
//   //     <div className="popup">
//   //       <div className="popup-content">
//   //         <h3>Select Teachers for {selectedCourse.name}</h3>
//   //         <form onSubmit={handleAssign}>
//   //           {dummyTeachers.map((teacher, index) => (
//   //             <div key={index} className="form-check">
//   //               <input
//   //                 className="form-check-input"
//   //                 type="checkbox"
//   //                 value={teacher}
//   //                 id={`teacher-${index}`}
//   //               />
//   //               <label
//   //                 className="form-check-label"
//   //                 htmlFor={`teacher-${index}`}
//   //               >
//   //                 {teacher}
//   //               </label>
//   //             </div>
//   //           ))}
//   //         </form>
//   //         <button
//   //           className="btn btn-primary me-2"
//   //           onClick={() => setPopupOpen(false)}
//   //         >
//   //           Close
//   //         </button>
//   //       </div>
//   //     </div>
//   //   );
//   // };

//   const handleAssign = () => {
//     // e.preventDefault();
//     // const selectedTeachers: string[] = [];
//     // const checkboxes = e.currentTarget.querySelectorAll<HTMLInputElement>(
//     //   'input[type="checkbox"]:checked'
//     // );
//     // checkboxes.forEach((checkbox) => {
//     //   selectedTeachers.push(checkbox.value);
//     // });
//     // assignTeachers(selectedTeachers);
//     const selectedTeachers: string[] = [];
//     const checkboxes = document.querySelectorAll<HTMLInputElement>(
//       'input[type="checkbox"]:checked'
//     );
//     checkboxes.forEach((checkbox) => {
//       selectedTeachers.push(checkbox.value);
//     });
//     assignTeachers(selectedTeachers);
//   };

//   const handleDelete = (courseId: number, isAssigned: boolean) => {
//     if (isAssigned) {
//       setAssignedCourses(
//         assignedCourses.filter((course) => course.id !== courseId)
//       );
//     } else {
//       setUnassignedCourses(
//         unassignedCourses.filter((course) => course.id !== courseId)
//       );
//     }
//   };

//   // Render function to display course lists
//   const renderCourseList = (
//     title: string,
//     courseList: Course[],
//     isAssigned: boolean
//   ) => (
//     <div className="col-md-6">
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5
//             className="card-title mb-3"
//             style={{ fontSize: "30px", fontWeight: "normal" }}
//           >
//             {title}
//           </h5>
//           <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
//             <ul className="list-group list-group-flush">
//               {courseList.map((course) => (
//                 <div
//                   key={course.id}
//                   className="list-group-item d-flex justify-content-between align-items-center"
//                 >
//                   <Link to={`/course-details/${course.id}`}>
//                     {course.name} ({course.level})
//                   </Link>
//                   <div>
//                     <button
//                       className="btn btn-primary me-2"
//                       onClick={() => togglePopup(course)}
//                       style={{ backgroundColor: "#005a5a" }}
//                     >
//                       Assign
//                     </button>
//                     <button
//                       className="btn btn-outline-danger"
//                       onClick={() => handleDelete(course.id, isAssigned)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const handleCreateCourse = () => {
//     // Navigate to the create course page
//     // You can replace "/create-course" with the actual route for the create course page
//     window.location.href = "/course-create";
//   };

//   return (
//     <div
//       className="container-fluid py-5"
//       style={{
//         backgroundImage: `url('bg_4.png')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <Navbar_temp />
//       {renderPopup()}
//       <div className="row justify-content-center align-items-center">
//         <div className="col-md-10">
//           <div
//             className="card shadow w-100 mx-auto"
//             style={{
//               backgroundColor: "rgba(255, 255, 255, 0.5)",
//               borderRadius: "5px",
//             }}
//           >
//             <div className="card-body">
//               <h2 className="card-title mb-4 text-center">Courses</h2>
//                {/* Button to navigate to the create course page */}
//                <div className="text-center mb-4">
//                 <button
//                   className="btn btn-primary"
//                   onClick={handleCreateCourse}
//                 >
//                   Create A Course
//                 </button>
//               </div>
//               <div className="row">
//                 {renderCourseList("Assigned Courses", assignedCourses, true)}
//                 {renderCourseList(
//                   "Unassigned Courses",
//                   unassignedCourses,
//                   false
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default AdminDashboard;
