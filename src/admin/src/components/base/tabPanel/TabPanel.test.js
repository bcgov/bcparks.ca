import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TabPanel from "./TabPanel";

describe("<TabPanel />", () => {
  test("it should mount", () => {
    render(<TabPanel />);

    const tabPanel = screen.getByTestId("TabPanel");

    expect(tabPanel).toBeInTheDocument();
  });
});
