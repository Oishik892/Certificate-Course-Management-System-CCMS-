import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import Courses from "./pages/Courses.tsx";
// import Navbar from "./components/Navbar.tsx";

import AdminDashboard from "./components/AdminDashboard.tsx";
import LandingPage from "./components/LandingPage.tsx";
import LoginForm from "./components/LoginForm.tsx";
import SignUpForm from "./components/SignUpForm.tsx";
import SignUpForm_2 from "./components/SignUpForm_2.tsx";
import StudentDashboard from "./components/StudentDashboard.tsx";
import TeacherDashboard from "./components/TeacherDashboard.tsx";
// import SignUp_temp from "./components/SignUp_temp.tsx";
import AdminLoginForm from "./components/AdminLoginForm.tsx";
// import TeacherProfile from "./components/TeacherProfile.tsx";
import Child1 from "./components/Child1.tsx";
import CoursePage from "./components/CourseDetails/CoursePage.tsx";
import CreateCourseForm from "./components/CreateCourseForm.tsx";
// import Certificate from "./components/Certificate/Certificate.js";
import Certificate from "./components/Certificate/Certificate.tsx";
// import Certificate_page from "./components/Certificate/Certificate_page.tsx";

// Define userRole here
// const userRole = "";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUpForm />,
  },
  {
    path: "/signup_2",
    element: <SignUpForm_2 />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/student-dashboard/:id",
    element: <StudentDashboard />,
  },
  {
    path: "/teacher-dashboard/:id",
    element: <TeacherDashboard />,
  },
  // {
  //   path: "/teacher-dashboard/profile",
  //   element: <TeacherProfile/>
  // },
  {
    path: "/",
    element: <LandingPage />,
  },
  // {
  //   path: "/test",
  //   element: <Test/>
  // },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin-login",
    element: <AdminLoginForm />,
  },
  {
    path: "/course-create",
    element: <CreateCourseForm />,
  },
  {
    // path: "/course-page/:courseid/:studentid?",
    path: "/course-page/:courseid",
    element: <CoursePage />,
  },
  {
    path: "/child1/:studentid",
    element: <Child1 />,
  },
  {
    path: "/certificate/:studentid/:courseid",
    element: <Certificate />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <SignUp_temp/> */}
  </React.StrictMode>
);
