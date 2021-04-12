import React from "react";
import Spinner from "react-bootstrap/Spinner";
import "./Loading.css";

function Loading() {
  return (
    <>
      <br className="px-30" />
      <div className="d-flex justify-content-center">
        <Spinner animation="border" variant="light" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    </>
  );
}

export default Loading;
