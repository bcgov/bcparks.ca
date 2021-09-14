import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import DataTable from "./DataTable";

describe("<DataTable />", () => {
  test("it should mount", () => {
    render(<DataTable />);

    const DataTable = screen.getByTestId("DataTable");

    expect(DataTable).toBeInTheDocument();
  });
});
