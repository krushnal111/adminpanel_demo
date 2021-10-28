import React from "react";
import Skeleton from "react-loading-skeleton"; // React skeleton loader view
/******************* 
@Purpose : Used for loader view
@Parameter : {}
@Author : INIC
******************/
function Loader() {
  return (
    <div className="container">
      <div className="offline-inner">
        <div style={{ fontSize: 20, lineHeight: 2 }}>
          <h1>
            <Skeleton count={2} />
          </h1>
          <h3>
            <Skeleton count={2} />
          </h3>
          <h3>
            <Skeleton count={2} />
          </h3>
          <h3>
            <Skeleton count={2} />
          </h3>
          <h3>
            <Skeleton count={2} />
          </h3>
          <h3>
            <Skeleton count={2} />
          </h3>
          <h3>
            <Skeleton count={2} />
          </h3>
        </div>
      </div>
    </div>
  );
}
export default Loader;
