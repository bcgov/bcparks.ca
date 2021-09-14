import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SwitchButton from "./SwitchButton";

describe("<SwitchButton />", () => {
  test("it should mount", () => {
    render(<SwitchButton />);

    const switchButton = screen.getByTestId("SwitchButton");

    expect(switchButton).toBeInTheDocument();
  });
});
