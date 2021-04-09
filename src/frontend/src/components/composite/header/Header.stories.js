import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

import Header from "./Header";

export default {
  title: "Header",
  component: Header
};

const header = {
  name: "Criminal Record Check"
};

const history = createMemoryHistory();

export const Default = () => (
  <Router history={history}>
    <Header header={header} />
  </Router>
);

export const Mobile = () => (
  <Router history={history}>
    <Header header={header} />
  </Router>
);

Mobile.story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile2"
    }
  }
};
