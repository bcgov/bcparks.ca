import React from "react";
import Header from "../../composite/header/Header";
import styles from "./About.css";

const About = () => {
  return (
    <main>
      <Header />
      <div className={styles.Home} data-testid="Home">
        <div className="container hm-container mt-5">
          <h3 className="mb-5">Staff web portal</h3>
          <h4 className="m-2 p-0">Version: 1.0.0</h4>
          <h4 className="m-2 p-0">Last Updated: June 15, 2021</h4>
        </div>
      </div>
    </main>
  );
};

About.propTypes = {};

About.defaultProps = {};

export default About;
