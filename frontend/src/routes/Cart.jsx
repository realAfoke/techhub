import Item from "../components/Items";
import { api } from "../utils";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function Cart() {
  const location = useLocation();
  const { appData, handleAppData, isAuthenticated } = useOutletContext();
  const cartedItem = appData.carts?.items?.map((item) => {
    return (
      <li key={item.product.name}>
        <Item
          item={item}
          cartId={appData.carts?.cartId}
          handleAppData={handleAppData}
          status={appData.status}
        />
      </li>
    );
  });
  return (
    <>
      {!location.pathname.includes("checkout") && (
        <div className="mt-[4rem] bg-[#f1eaea6c]">
          <div className=" text-gray-700 px-5 py-4 font-[500] text-[19px] md:text-[14px] tracking-tighter">
            CART SUMMARY
          </div>
          <div className="bg-white  px-5 py-2 font-[500] flex justify-between items-center">
            <span className="text-[19px]  md:text-[14px]">subtotal</span>
            <span className="text-[23px]  md:text-[16px]">
              ${appData.subTotal}
            </span>
          </div>
          <div
            className={`text-gray-700 px-5 py-3 font-[500] text-[19px] tracking-tighter  md:text-[14px]`}
          >
            CART {appData.quantity > 0 && `(${appData.quantity})`}
          </div>
          {appData.quantity > 0 ? (
            cartedItem
          ) : (
            <div>you dont have any item in cart </div>
          )}
          <div
            className={`bg-white p-5 flex items-center mt-5  ${
              appData.quantity > 0 ? "block" : "hidden"
            }`}
          >
            <Link to={"/checkout"} className="flex w-full">
              <button className="bg-[orange] text-white outline-none rounded-[5px] font-[500] text-xl md:text-[16px] py-3 px-5  w-[100%]">
                Checkout {`($ ${appData.subTotal})`}
              </button>
            </Link>
          </div>
        </div>
      )}
      {/* <Outlet context={{ appData.carts, isAuthenticated }} /> */}
    </>
  );
}
