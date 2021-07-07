import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppDashboard from "./AppDashboard";

describe("<AppDashboard />", () => {
  test("it should mount", () => {
    render(<AppDashboard />);

    const appDashboard = screen.getByTestId("AppDashboard");

    expect(appDashboard).toBeInTheDocument();
  });
});
