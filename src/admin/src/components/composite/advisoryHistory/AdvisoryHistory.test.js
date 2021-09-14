import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AdvisoryHistory from "./AdvisoryHistory";

describe("<AdvisoryHistory />", () => {
  test("it should mount", () => {
    render(<AdvisoryHistory />);

    const advisoryHistory = screen.getByTestId("AdvisoryHistory");

    expect(advisoryHistory).toBeInTheDocument();
  });
});
