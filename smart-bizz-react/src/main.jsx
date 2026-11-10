import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { site } from "./config/site";
import "./firebase";
import "./index.css";

// Use the logo as the browser-tab icon.
document.getElementById("favicon")?.setAttribute("href", site.logo);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
