import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { useHistory } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { Header } from "shared-components/build/components/header/Header";

function App() {
  const header = {
    name: "",
    history: useHistory(),
  };
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <div className="App">
        <Header header={header} />
        <AppRouter />
      </div>
    </ReactKeycloakProvider>
  );
}

export default App;
