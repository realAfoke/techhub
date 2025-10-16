import React from "react";
import * as ReactDom from "react-dom/client";
import "./styles/app.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { loader } from "./utils";
import ProductDetail, { productDetailLoader } from "./pages/productDetail";
import App, { appLoader } from "./routes/App";
import ProductList from "./pages/productList";
import Cart from "./routes/Cart";
import Create, { checkAccountAction } from "./routes/create";
import Password, { createAction } from "./components/Password";
import Login, { loginAction } from "./pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader,
    children: [
      {
        index: true,
        element: <ProductList />,
      },
      {
        path: "product/:productId",
        element: <ProductDetail />,
        loader: productDetailLoader,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "create-account",
    element: <Create />,
    action: checkAccountAction,
    children: [
      { path: "password", element: <Password />, action: createAction },
    ],
  },
  {
    path: "login",
    element: <Login />,
    action: loginAction,
  },
]);

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service worker registered:", reg))
      .catch((err) =>
        console.error("Service Worker regristration failed:", err)
      );
  });
}
