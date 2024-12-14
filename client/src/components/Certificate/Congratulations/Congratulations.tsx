import React from "react";
import './Congratulations.css'
const Congratulations: React.FC = () => {
  return (
    <div className="container mt-5"> {/* Add margin top */}
      <div className="row justify-content-center">
        <div className="col-md-6 text-center" id="congratulations">
          <h1 style={{fontWeight:'bold', fontSize:'30px', color:'#005a5a'}}>Congratulations!</h1>
        </div>
      </div>
    </div>
  );
};

export default Congratulations;
