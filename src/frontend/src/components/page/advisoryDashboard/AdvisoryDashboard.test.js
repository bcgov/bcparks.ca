import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AdvisoryDashboard from "./AdvisoryDashboard";

describe("<AdvisoryDashboard />", () => {
  test("it should mount", () => {
    render(<AdvisoryDashboard />);

    const advisoryDashboard = screen.getByTestId("AdvisoryDashboard");

    expect(advisoryDashboard).toBeInTheDocument();
  });
});
