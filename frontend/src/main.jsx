import React from "react";
import * as ReactDom from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App, { loader as appLoader } from "./App";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    loader: appLoader,
  },
]);
ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
