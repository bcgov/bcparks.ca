import React from "react";
import "./QuickLinks.css";
import image1 from "../../../../src/assets/bc-parks-foundation-icon@2x.png";
import image2 from "../../../../src/assets/support-icon@2x.png";
import image3 from "../../../../src/assets/bc-parks-licence-plates-icon@2x.png";
import image4 from "../../../../src/assets/learn-more-icon@2x.png";

function QuickLinks() {
  return (
    <div className="QuickLinks" data-testid="QuickLinks">
      <section className="padding-vertical">
        <div className="container">
          <div className="row justify-content-around">
            <div className="col-5 col-lg-2 text-center link">
              <img src={image2} alt="Support us"></img>
              <div>
                <a
                  href="https://bcparks.ca/get-involved"
                  className="pb-5 pb-lg-0"
                >
                  Support us
                </a>
              </div>
            </div>
            <div className="col-5 col-lg-2 text-center link">
              <img src={image3} alt="BC Parks licence plates"></img>
              <div>
                <a
                  href="https://bcparks.ca/licence-plates"
                  className="pb-5 pb-lg-0"
                >
                  BC Parks licence plates
                </a>
              </div>
            </div>
            <div className="col-5 col-lg-2 text-center link">
              <img src={image4} alt="Learn more"></img>
              <div>
                <a href="https://bcparks.ca/learn-more">Learn more</a>
              </div>
            </div>
            <div className="col-5 col-lg-2 text-center link">
              <img src={image1} alt="BC Parks Foundation"></img>
              <div>
                <a href="https://bcparksfoundation.ca">BC Parks Foundation</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default QuickLinks;
