import React from 'react'
import Congratulations from './Congratulations/Congratulations'
import Navbar_temp from '../Navbar_temp'
import Certificate from './Certificate';

// Define the interface for props
interface Certificate_pageProps {
    name: string;
    course: string;
  }
  
  // Modify the component to accept props
  const Certificate_page: React.FC<Certificate_pageProps> = ({ name, course }) => {
  return (
    <div className="container-fluid flex-fill py-5" style={{ backgroundImage: `url('bg_8(1).jpg')`, backgroundSize: "cover", backgroundPosition: "center", }}>
    <Navbar_temp/>
    <Congratulations></Congratulations>
    <Certificate name={name} course = {course}></Certificate>
    </div>
  )
}

export default Certificate_page