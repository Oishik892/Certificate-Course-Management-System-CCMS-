// import React from 'react'
// import Navbar from '../components/Navbar'
import AboutSection from "./AboutSection";
import HeroSection from "./HeroSection";
import Navbar_temp from "./Navbar_temp";
// import CourseList_nonAdmin from './CourseList_nonAdmin'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseBox from "./CourseBox/CourseBox";

const Test = () => {
  const navigate = useNavigate();
  const [id, setId] = useState(useParams().id);

  const [_userExists, setUserExists] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const userid = localStorage.getItem("userid");
    if (userid) {
      setId(userid);
      setUserExists(true);
      const _role = localStorage.getItem("role");
      if (_role) {
        setRole(_role);
      }
    } else {
      setUserExists(false);
    }
  }, []);

  if (id && _userExists) {
    navigate(
      role === "student"
        ? `/student-dashboard/${id}`
        : role === "teacher"
        ? `/teacher-dashboard/${id}`
        : role === "admin"
        ? "/admin-dashboard"
        : "/"
    );
  }
  return (
    <div
      className="container-fluid flex-fill py-5"
      style={{
        backgroundImage: `url('bg_8(1).jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar_temp userExists={false} />
      <HeroSection></HeroSection>
      {/* <Charts></Charts> */}
      {/* <CourseList_nonAdmin/> */}
      <CourseBox></CourseBox>
      <AboutSection></AboutSection>
    </div>
  );
};

export default Test;
