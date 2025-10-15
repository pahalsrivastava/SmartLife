import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { AppThemeProvider } from "./theme/ThemeProvider";
import App from "./App";
import "./index.css";

const clerkPublishableKey = "pk_test_Y29tbXVuYWwtamFja2FsLTc0LmNsZXJrLmFjY291bnRzLmRldiQ";

const AppRoot = (
  <AppThemeProvider>
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SnackbarProvider>
  </AppThemeProvider>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      {AppRoot}
    </ClerkProvider>
  </React.StrictMode>
);
