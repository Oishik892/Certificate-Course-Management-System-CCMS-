import React, { useEffect, useState } from "react";

interface StudentData {
  studentid: string;
  studentfirstname: string;
  studentlastname: string;
  email: string;
  password: string;
}

interface TeacherData {
  teacherid: string;
  teacherfirstname: string;
  teacherlastname: string;
  email: string;
  password: string;
  designation: string;
  image: string | null;
}

const UserProfile: React.FC<{ role: string; userid: string }> = ({
  role,
  userid,
}) => {
  const imgLinks = [
    "https://plus.unsplash.com/premium_photo-1723028769924-d18a792aeb07?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1723220451359-525a9d405682?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response: Response;
        if (role === "student") {
          response = await fetch(
            `http://localhost:5000/student-dashboard/${userid}`
          );
          const data: StudentData = await response.json();
          setStudentData(data);
        } else if (role === "teacher") {
          response = await fetch(
            `http://localhost:5000/teacher-dashboard/${userid}`
          );
          const data: TeacherData = await response.json();
          setTeacherData(data);
        }
      } catch (error) {
        setError("Error fetching user data");
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userid) {
      fetchUserData();
    }
  }, [role, userid]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderTeacherImage = () => {
    if (teacherData && teacherData.image) {
      return (
        <img
          src={`data:image/jpeg;base64,${teacherData.image}`}
          alt="Teacher"
          className="rounded-circle"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      );
    }

    return (
      <img
        // src="https://via.placeholder.com/50"
        src={imgLinks[Math.floor(Math.random() * 3)]}
        alt="User"
        className="rounded-circle"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
    );
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row">
          {/* Left column for text */}
          <div className="col-md-8">
            {/* console.log(`teacher id: ${teacherid}`) */}
            <h5 className="card-title">
              Hello,{" "}
              {role === "student"
                ? studentData?.studentfirstname
                : teacherData?.teacherfirstname || "User"}
              !
            </h5>
            <p className="card-text">
              {role === "student" ? studentData?.email : teacherData?.email}
              <br />
              {role === "student" && <strong>Student</strong>}
              {role === "teacher" && <strong>Teacher</strong>}
              {role === "teacher" && teacherData?.designation && (
                <>
                  <br />
                  <strong>Designation:</strong> {teacherData.designation}
                </>
              )}
            </p>
          </div>
          {/* Right column for image */}
          {/* <div className="col-md-4 d-flex justify-content-end">
            {teacherData.image && (
              <img src={`data:image/jpeg;base64,${teacherData.image}`} alt="Teacher" />
            )}
            <img
              src={"https://via.placeholder.com/50"} // Dummy image URL
              alt="User"
              className="rounded-circle"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div> */}
          <div className="col-md-4 d-flex justify-content-end">
            {role === "teacher" && renderTeacherImage()}
            {role === "student" && (
              // <img
              //   src="/https://via.placeholder.com/50"
              //   alt="User"
              //   className="rounded-circle"
              //   style={{ width: "100px", height: "100px", objectFit: "cover" }}
              // />
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
