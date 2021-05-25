import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AdvisoryForm from "./AdvisoryForm";

describe("<AdvisoryForm />", () => {
  test("it should mount", () => {
    render(<AdvisoryForm />);

    const advisoryForm = screen.getByTestId("AdvisoryForm");

    expect(advisoryForm).toBeInTheDocument();
  });
});
