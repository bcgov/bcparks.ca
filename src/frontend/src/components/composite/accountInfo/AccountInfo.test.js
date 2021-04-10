import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AccountInfo from "./AccountInfo";

describe("<AccountInfo />", () => {
  test("it should mount", () => {
    render(<AccountInfo />);

    const accountInfo = screen.getByTestId("AccountInfo");

    expect(accountInfo).toBeInTheDocument();
  });
});
