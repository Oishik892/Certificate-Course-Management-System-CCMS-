import axios from "axios";
import { defaults } from "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "./Charts.css";
import ageData from "./data/ageData.json";
// Type definitions for the data

interface SignUpData {
  label: string;
  student: number;
  teacher: number;
}

// interface SubjectData {
//   label: string;
//   value: number;
// }
interface SignUpData {
  role: string;
  month: string;
  full_month: string;
  month_num: string;
  usercount: string;
}
interface StudentAgeData {
  ageGroup: string;
  count: number;
}
interface CourseData {
  coursename: string;
  enrolledstudents: string;
}
// ChartJS default settings
defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

// TypeScript component definition
const Charts: React.FC = () => {
  const [signUpData, setSignUpData] = useState<SignUpData[]>([]);
  const [topCoursesData, setTopCoursesData] = useState<CourseData[]>([]);
  useEffect(() => {
    const fetchSignUpData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/signUpData");
        setSignUpData(response.data);
      } catch (error) {
        console.error("Error fetching sign up data:", error);
      }
    };

    const fetchTopCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/topCourses");
        const data = response.data;

        // Sort and take the top 5 most enrolled courses
        const topCourses = data
          .sort(
            (a: CourseData, b: CourseData) =>
              parseInt(b.enrolledstudents, 10) -
              parseInt(a.enrolledstudents, 10)
          )
          .slice(0, 5);
        setTopCoursesData(topCourses);
      } catch (error) {
        console.error("Error fetching top courses:", error);
      }
    };

    fetchSignUpData();
    fetchTopCourses();
  }, []);

  const months = signUpData.map((data) => data.month);
  const studentData = signUpData
    .filter((data) => data.role === "student")
    .map((data) => parseInt(data.usercount, 10));
  const teacherData = signUpData
    .filter((data) => data.role === "teacher")
    .map((data) => parseInt(data.usercount, 10));
  return (
    // <div className="row justify-content-center align-items-center">
    <div className="container ">
      <div
        className="card mt-4 shadow w-100 mx-auto"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: "5px",
        }}
      >
        <h2 className="card-title mt-3 text-center">
          Website Activity Dashboard
        </h2>
        <div className="App">
          {/* <div className="dataCard signUpCard">
            <Line
              data={{
                labels: (signUpData as SignUpData[]).map((data) => data.label),
                datasets: [
                  {
                    label: "Student",
                    data: (signUpData as SignUpData[]).map((data) => data.student),
                    backgroundColor: "#005a5a",
                    borderColor: "#005a5a",
                  },
                  {
                    label: "Teacher",
                    data: (signUpData as SignUpData[]).map((data) => data.teacher),
                    backgroundColor: "#9bd0ca",
                    borderColor: "#9bd0ca",
                  },
                ],
              }}
              options={{
                elements: {
                  line: {
                    tension: 0.6,
                  },
                },
                plugins: {
                  title: {
                    text: "Monthly User Sign Up",
                  },
                },
              }}
            />
          </div> */}

          <div className="dataCard signUpCard">
            <Line
              data={{
                labels: months,
                datasets: [
                  {
                    label: "Student",
                    data: studentData,
                    backgroundColor: "#005a5a",
                    borderColor: "#005a5a",
                  },
                  {
                    label: "Teacher",
                    data: teacherData,
                    backgroundColor: "#9bd0ca",
                    borderColor: "#9bd0ca",
                  },
                ],
              }}
              options={{
                elements: {
                  line: {
                    tension: 0.01,
                  },
                },
                plugins: {
                  title: {
                    text: "Monthly User Sign Up",
                  },
                },
              }}
            />
          </div>

          <div className="dataCard ageCard">
            <Bar
              data={{
                labels: (ageData as StudentAgeData[]).map(
                  (data) => data.ageGroup
                ),
                datasets: [
                  {
                    label: "Count",
                    data: (ageData as StudentAgeData[]).map(
                      (data) => data.count
                    ),
                    backgroundColor: [
                      "rgba(0, 90, 90, 0.8)",
                      "rgba(155, 208, 202, 0.8)",
                      "rgba(90, 141, 135, 0.8)",
                    ],
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: "Student Age Profile",
                  },
                },
              }}
            />
          </div>

          {/* <div className="dataCard subjectCard">
            <Doughnut
              data={{
                labels: (subjectData as SubjectData[]).map((data) => data.label),
                datasets: [
                  {
                    label: "Count",
                    data: (subjectData as SubjectData[]).map((data) => data.value),
                    backgroundColor: [
                      "rgba(0, 90, 90, 0.8)",
                      "rgba(155, 208, 202, 0.8)",
                      "rgba(90, 141, 135, 0.8)",
                    ],
                    borderColor: [
                      "rgba(0, 90, 90, 0.8)",
                      "rgba(155, 208, 202, 0.8)",
                      "rgba(90, 141, 135, 0.8)",
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: "Top 3 Subjects",
                  },
                },
              }}
            />
          </div> */}
          <div className="dataCard topCoursesCard">
            <Doughnut
              data={{
                labels: topCoursesData.map((course) => course.coursename),
                datasets: [
                  {
                    label: "Enrollments",
                    data: topCoursesData.map((course) =>
                      parseInt(course.enrolledstudents, 10)
                    ),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: "Top 5 Most Enrolled Courses",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
