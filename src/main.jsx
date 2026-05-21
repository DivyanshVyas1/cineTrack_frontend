import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/theme.css";
import "./styles/globals.css";
import "./styles/cinematic.css";
import "./styles/responsive.css";
import App from "./App";
import StoreProvider from "./app/providers/StoreProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <App />
        <ToastContainer position="bottom-right" autoClose={1500} theme="dark" />
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>
);
