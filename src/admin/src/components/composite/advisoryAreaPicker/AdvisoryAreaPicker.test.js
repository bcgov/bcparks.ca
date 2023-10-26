import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AdvisoryAreaPicker from "./AdvisoryAreaPicker";

describe("<AdvisoryAreaPicker />", () => {
  test("it should mount", () => {
    render(<AdvisoryAreaPicker />);

    const advisoryAreaPicker = screen.getByTestId("AdvisoryAreaPicker");

    expect(advisoryAreaPicker).toBeInTheDocument();
  });
});
