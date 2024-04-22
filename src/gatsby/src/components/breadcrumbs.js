import React from "react";

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <nav aria-label="breadcrumb" className="breadcrumbs">
      <ol>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index}>
            {breadcrumb}
            {index !== breadcrumbs.length - 1 && <span className="separator">{"›"}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
