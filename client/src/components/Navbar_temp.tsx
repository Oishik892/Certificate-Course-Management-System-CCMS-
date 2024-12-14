// import React, { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface NavbarTempProps {
  userExists: boolean; // Accept userExists prop
}
const Navbar_temp: React.FC<NavbarTempProps> = ({ userExists }) => {
  // const [showSignupLogin, setShowSignupLogin] = useState(true);

  // useEffect(() => {
  //   const currentURL = window.location.pathname;
  //   // Logic to toggle visibility based on the current URL
  //   if (currentURL === "/") {
  //     setShowSignupLogin(true); // Hide signup-login buttons on login/signup pages
  //   } else {
  //     setShowSignupLogin(false); // Show signup-login buttons on other pages
  //   }
  // }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userid");
    navigate("/");
  };
  const isAdminLogin = window.location.pathname.includes("/admin-login");
  const [id, setId] = useState(useParams().id);

  const [_userExists, setUserExists] = useState(userExists);
  const [role, setRole] = useState("");

  useEffect(() => {
    const getItems = () => {
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
    };
    getItems();
    window.addEventListener("storage", getItems);
    return () => {
      window.removeEventListener("storage", getItems);
    };
  }, []);

  return (
    <div className="container-fluid">
      <nav
        className="navbar navbar-expand-sm navbar-light bg-light rounded  mb-5 shadow-sm"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      >
        <Link
          to={
            role === "student"
              ? `/student-dashboard/${id}`
              : role === "teacher"
              ? `/teacher-dashboard/${id}`
              : role === "admin"
              ? "/admin-dashboard"
              : "/"
          }
        >
          {" "}
          {/* Wrap the image with a Link component */}
          <img
            src="/CCMS_Logo_4.png"
            alt=""
            style={{ width: "50px", height: "auto" }}
            className="me-3 ms-3"
          />
        </Link>
        <Link
          className="navbar-brand mx-auto"
          to={
            role === "student"
              ? `/student-dashboard/${id}`
              : role === "teacher"
              ? `/teacher-dashboard/${id}`
              : role === "admin"
              ? "/admin-dashboard"
              : "/"
          }
          style={{ fontWeight: "bold" }}
        >
          CCMS
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto me-4">
            {isAdminLogin ? null : _userExists ? ( // Check if it's the admin login page // Render nothing if it's the admin login page // If userExists is true, show Logout
              <>
                <li className="nav-item">
                  {/* <span className="nav-link">Welcome!</span>{" "} */}
                  {/* Replace with actual user info if needed */}
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // If userExists is false, show Sign Up and Login
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar_temp;
