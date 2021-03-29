import React, { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./CreateAdvisory.css";
import { Header } from "shared-components/build/components/header/Header";
import { Button } from "shared-components/build/components/button/Button";
import { Input } from "shared-components/build/components/input/Input";
import { Dropdown } from "shared-components/build/components/dropdown/Dropdown";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ImageUploader from "react-images-upload";

export default function CreateAdvisory({ page: { header, setError } }) {
  const [toError, setToError] = useState(false);
  const [toHome, setToHome] = useState(false);
  const [pictures, setPictures] = useState([]);

  const input1 = {
    label: "",
    id: "textInputId",
    placeholder: "Enter value",
    isReadOnly: false,
    isRequired: false,
  };
  const input2 = {
    label: "",
    id: "textInputId",
    placeholder: "Enter value",
    isReadOnly: false,
    isRequired: false,
  };
  const items = ["Select", "Option 1", "Option 2", "Option 3", "Option 4"];

  const onDrop = (picture) => {
    console.log("Im called");
    setPictures([...pictures, picture]);
  };

  if (toHome) {
    return <Redirect to="/bcparks" />;
  }

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  return (
    <main>
      <Header header={header} />
      <br />
      <div className="CreateAdvisory" data-testid="CreateAdvisory">
        <div className="container">
          <h3>Submit a new advisory</h3>
          <form>
            <div className="container-fluid ad-form">
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Headline
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <Input
                    input={{
                      ...input1,
                      styling: "bcgov-editable-white",
                    }}
                    onChange={() => {}}
                  />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Event type
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <Dropdown items={items} onSelect={() => {}} />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Description
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <textarea
                    className="bcgov-text-input"
                    id="description"
                    rows="2"
                    onChange={() => {}}
                  />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Location
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <Input
                    input={{
                      ...input1,
                      styling: "bcgov-editable-white",
                    }}
                    onChange={() => {}}
                  />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Urgency level
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <ButtonGroup
                    className="ad-btn-group"
                    color="primary"
                    aria-label="outlined primary button group"
                  >
                    <Button
                      label="Low"
                      styling="bcgov-normal-blue btn"
                      onClick={() => {}}
                    >
                      One
                    </Button>
                    <Button
                      label="Medium"
                      styling="bcgov-normal-white btn"
                      onClick={() => {}}
                    >
                      Two
                    </Button>
                    <Button
                      label="High"
                      styling="bcgov-normal-white btn"
                      onClick={() => {}}
                    >
                      Three
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Effective date
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <div className="row ad-row">
                    <div className="col-lg-6">
                      <Input
                        input={{
                          ...input1,
                          styling: "bcgov-editable-white",
                        }}
                        onChange={() => {}}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Input
                        input={{
                          ...input1,
                          styling: "bcgov-editable-white",
                        }}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                  <div className="row ad-row">
                    <div className="col-lg-6">
                      <Input
                        input={{
                          ...input1,
                          styling: "bcgov-editable-white",
                        }}
                        onChange={() => {}}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Input
                        input={{
                          ...input1,
                          styling: "bcgov-editable-white",
                        }}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Photos
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <ImageUploader
                    withIcon={false}
                    onChange={onDrop}
                    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                    maxFileSize={5242880}
                    withPreview={true}
                    buttonText="Add a photo"
                    buttonClassName="bcgov-normal-blue btn"
                    withLabel={false}
                  />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <hr />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Internal notes
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <Input
                    input={{
                      ...input1,
                      styling: "bcgov-editable-white",
                    }}
                    onChange={() => {}}
                  />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4"></div>
                <div className="col-lg-8 col-md-8 col-sm-12 button-row ad-row ad-btn-group">
                  <Button
                    label="Duplicate"
                    styling="bcgov-normal-yellow btn"
                    onClick={() => {
                      sessionStorage.clear();
                      setToHome(true);
                    }}
                  />
                  <Button
                    label="Update"
                    styling="bcgov-normal-white btn"
                    onClick={() => {
                      sessionStorage.clear();
                      setToHome(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <br />
      </div>
    </main>
  );
}

CreateAdvisory.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    header: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
