import React from "react";
import { Loader } from "shared-components/build/components/loader/Loader";
import "./Loading.css";

function Loading() {
  return (
    <>
      <div className="justify-content-center page-loader">
        <Loader page />;
      </div>
    </>
  );
}

export default Loading;
