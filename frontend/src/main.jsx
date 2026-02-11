import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { WorkProvider } from "./context/WorkContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <WorkProvider>
      <App />
    </WorkProvider>
  </BrowserRouter>,
);
