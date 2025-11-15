import React from "react";
import * as ReactDom from "react-dom/client";
import "./styles/app.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProductDetail, { productDetailLoader } from "./pages/productDetail";
import App, { appLoader } from "./routes/App";
import ProductList from "./pages/productList";
import Cart from "./routes/Cart";
import Create, { checkAccountAction } from "./routes/create";
import Password, { createAction } from "./components/Password";
import CheckOut, { checkOutLoader } from "./pages/checkout";
import Login, { loginAction } from "./pages/login";
import Profile, { profileLoader } from "./pages/Profile";
import ErrorPage from "./pages/error";
import DashBoard from "./pages/DashBoard";
import ProfileOrder from "./pages/ProfileOrders";
import AccountDetail from "./pages/AccountDetail";
import Address from "./pages/Address";
import ChangePassword from "./pages/ChangePassWord";
import ResetPassword from "./routes/resetPassWord";
import NewPassword from "./pages/NewPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader,
    errorElement: <ErrorPage />,
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
        // children: [],
      },
    ],
  },
  {
    path: "checkout",
    element: <CheckOut />,
    loader: checkOutLoader,
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
  {
    path: "profile",
    element: <Profile />,
    loader: profileLoader,
    children: [
      { index: true, element: <DashBoard /> },
      { path: "order", element: <ProfileOrder /> },
      { path: "account-detail", element: <AccountDetail /> },
      { path: "address", element: <Address /> },
      { path: "password-change", element: <ChangePassword /> },
    ],
  },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "new-password/:tokenId", element: <NewPassword /> },
]);

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((reg) => console.log("Service worker registered:", reg))
//       .catch((err) =>
//         console.error("Service Worker regristration failed:", err)
//       );
//   });
// }

//  <div className="flex gap-3">
//    <div className="flex justify-between items-center border border-gray-400 rounded-xl flex-1 font-bold p-2">
//      <button
//        className="outline-none border-none"
//        onClick={() => setQuantity((prev) => (prev === 1 ? prev : prev - 1))}
//      >
//        -
//      </button>

//      <span>{quantity}</span>

//      <button
//        className="outline-none border-none"
//        onClick={() => setQuantity((prev) => prev + 1)}
//      >
//        +
//      </button>
//    </div>

//    <button
//      className="bg-orange-500 text-white rounded-xl flex-2 px-4"
//      onClick={async () => {
//        await addToCart(fullDetail.id, quantity);
//      }}
//    >
//      Add to Cart
//    </button>
//  </div>;
