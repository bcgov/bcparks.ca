import React from "react";
import { MemoryRouter } from "react-router-dom";

import Error from "./Error";

export default {
  title: "Error",
  component: Error
};

const header = {
  name: "Criminal Record Check"
};

const error = {};

const genericPage = {
  header,
  error
};

export const Default = () => (
  <MemoryRouter>
    <Error page={genericPage} />
  </MemoryRouter>
);

export const Mobile = () => (
  <MemoryRouter>
    <Error page={genericPage} />
  </MemoryRouter>
);

export const SessionExpired = () => (
  <MemoryRouter>
    <Error
      page={{ header, error: { status: 590, message: "Session Expired" } }}
    />
  </MemoryRouter>
);

export const ApiError = () => (
  <MemoryRouter>
    <Error page={{ header, error: { status: 400, message: "Not Found" } }} />
  </MemoryRouter>
);

export const AppUnauthorizedError = () => (
  <MemoryRouter>
    <Error page={{ header, error: { status: 403 } }} />
  </MemoryRouter>
);

export const BcscUnauthorizedError = () => (
  <MemoryRouter>
    <Error
      page={{ header, error: { status: 403, message: "BCSC login failed" } }}
    />
  </MemoryRouter>
);

Mobile.story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile2"
    }
  }
};
