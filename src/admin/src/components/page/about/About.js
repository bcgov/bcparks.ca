import React from "react";
import Header from "../../composite/header/Header";
import styles from "./About.css";

const About = () => {
  return (
    <main>
      <Header
        header={{
          name: "",
        }}
      />
      <div className={styles.Home} data-testid="Home">
        <div className="container hm-container mt-5">
          <h3 className="mb-5">BC Parks Staff Portal</h3>
          <h4 className="m-2 p-0">Version: 0.9.0</h4>
          <h4 className="m-2 p-0">Last Updated: June 11, 2021</h4>
        </div>
      </div>
    </main>
  );
};

About.propTypes = {};

About.defaultProps = {};

export default About;
