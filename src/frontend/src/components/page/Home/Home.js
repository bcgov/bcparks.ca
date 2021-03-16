import React, { useState, useEffect } from "react";
import { Dropdown } from "shared-components/build/components/dropdown/Dropdown";
import { Button } from "shared-components/build/components/button/Button";
import styles from "./Home.css";
import QuickLinks from "../../composite/QuickLinks/QuickLinks";
import axios from "axios";

function Home() {
  const [parks, setParks] = useState([]);

  useEffect(() => {
    console.log("I'm called");
    axios.get(`/parks`).then((res) => {
      const parkData = res.data;
      const parkNames = parkData.map((p) => {
        return p.ParkName;
      });
      setParks([...parkNames]);
    });
  }, [setParks]);

  return (
    <div className={styles.Home} data-testid="Home">
      <section className="explore-bc">
        <div className="gradient">
          <div className="container">
            <div className="row justify-content-lg-center">
              <div className="col-sm-12 col-lg-8">
                <div className="mx-3 mx-lg-0">
                  <h1>Explore BC Parks</h1>

                  <p>
                    British Columbia’s incredible system of provincial parks
                    offers experiences as unforgettable and diverse as the
                    province’s natural landscape.
                  </p>

                  <p>
                    You can find your next adventure here. If you know the name
                    of the park you want to visit, just type in the name and
                    follow the link.
                  </p>

                  <form className="form-home">
                    <Dropdown items={parks} onSelect={() => {}} />
                    <Button
                      onClick={() => {}}
                      label="Submit"
                      styling="bcgov-normal-white btn"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <QuickLinks></QuickLinks>
    </div>
  );
}

export default Home;
