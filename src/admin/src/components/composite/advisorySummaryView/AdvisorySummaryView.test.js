import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AdvisorySummaryView from "./AdvisorySummaryView";

describe("<AdvisorySummaryView />", () => {
  test("it should mount", () => {
    render(<AdvisorySummaryView />);

    const advisorySummaryView = screen.getByTestId("AdvisorySummaryView");

    expect(advisorySummaryView).toBeInTheDocument();
  });
});
