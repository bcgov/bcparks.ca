/* eslint-disable no-console */
import React from "react";
import { create } from "react-test-renderer";
import { MemoryRouter, Router } from "react-router-dom";
import { render, fireEvent, getByText, wait } from "@testing-library/react";
import { createMemoryHistory } from "history";

import Error from "./Error";

describe("Error Component", () => {
  const header = {
    name: "Criminal Record Check"
  };

  const error = { status: 403, message: "Unauthorized" };

  const page = {
    header,
    error
  };

  test("Matches the snapshot", () => {
    const ErrorPage = create(
      <MemoryRouter>
        <Error page={page} />
      </MemoryRouter>
    );
    expect(ErrorPage.toJSON()).toMatchSnapshot();
  });

  test("Validate home button click takes user home", async () => {
    const history = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <Error page={page} />
      </Router>
    );

    fireEvent.click(getByText(container, "Home"));

    await wait(() => {
      expect(history.location.pathname).toEqual("/");
      expect(sessionStorage.length).toEqual(0);
    });
  });

  test("Validate service unavailable case", async () => {
    console.error = jest.fn();

    const newPage = {
      header,
      error: null
    };

    const history = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <Error page={newPage} />
      </Router>
    );

    await expect(() => {
      getByText(container, "wrongtext");
    }).toThrow();

    expect(
      getByText(container, "Service is currently unavailable")
    ).toBeTruthy();
  });

  test("Validate unauthorized 403 case", async () => {
    const history = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <Error page={page} />
      </Router>
    );

    await expect(() => {
      getByText(container, "wrongtext");
    }).toThrow();

    expect(getByText(container, "Unauthorized entry")).toBeTruthy();
  });

  test("Validate login failed case", async () => {
    const newError = { status: 403, message: "BCSC login failed" };

    const newPage = {
      header,
      error: newError
    };

    const history = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <Error page={newPage} />
      </Router>
    );

    await expect(() => {
      getByText(container, "wrongtext");
    }).toThrow();

    expect(getByText(container, "Login failed")).toBeTruthy();
  });

  test("Validate session expired case", async () => {
    const updatedError = { ...error, status: 590 };

    const newPage = {
      header,
      error: updatedError
    };

    const history = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <Error page={newPage} />
      </Router>
    );

    await expect(() => {
      getByText(container, "wrongtext");
    }).toThrow();

    expect(getByText(container, "Your session has expired")).toBeTruthy();
  });

  test("Validate unexpected error case", async () => {
    const updatedError = { ...error, status: 204 };

    const newPage = {
      header,
      error: updatedError
    };

    const history = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <Error page={newPage} />
      </Router>
    );

    await expect(() => {
      getByText(container, "wrongtext");
    }).toThrow();

    expect(getByText(container, "An unknown error has occurred")).toBeTruthy();
  });
});
