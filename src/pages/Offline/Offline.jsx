import React from "react";
/******************* 
@Purpose : Used for offline page design
@Parameter : {}
@Author : INIC
******************/
function Offline() {
  return (
    <div className="container">
      <div className="offline-inner">
        <h4>No network</h4>
        <h5>Please make sure the Network</h5>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload(true)}
        >
          Reload
        </button>
      </div>
    </div>
  );
}

export default Offline;
