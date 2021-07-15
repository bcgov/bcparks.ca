import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ParkSearch from "./ParkSearch";

describe("<ParkSearch />", () => {
  test("it should mount", () => {
    render(<ParkSearch />);

    const parkSearch = screen.getByTestId("ParkSearch");

    expect(parkSearch).toBeInTheDocument();
  });
});
