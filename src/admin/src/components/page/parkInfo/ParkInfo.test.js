import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ParkInfo from "./ParkInfo";

describe("<ParkInfo />", () => {
  test("it should mount", () => {
    render(<ParkInfo />);

    const parkInfo = screen.getByTestId("ParkInfo");

    expect(parkInfo).toBeInTheDocument();
  });
});
