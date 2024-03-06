import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./components/keycloak";
import AppRouter from "./routes/AppRouter";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
const isFirefox = typeof InstallTrigger !== 'undefined';

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak} initOptions={isFirefox ? { checkLoginIframe: false } : {}}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <AppRouter />
        </div>
      </QueryClientProvider>
    </ReactKeycloakProvider>
  );
}

export default App;
