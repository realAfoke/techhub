import Item from "../components/Items";
import { api } from "../utils";
import { useLoaderData, Link } from "react-router-dom";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function Cart() {
  const { carts, handleCart } = useOutletContext();
  const cartedItem = carts.carts?.items?.map((item) => {
    return (
      <li key={item.id}>
        <Item item={item} handleCart={handleCart} status={carts.status} />
      </li>
    );
  });
  return (
    <>
      <div className="mt-[4rem] bg-[#f1eaea6c]">
        <div className=" text-gray-700 px-5 py-4 font-[500] text-[19px] tracking-tighter">
          CART SUMMARY
        </div>
        <div className="bg-white  px-5 py-2 font-[500] flex justify-between items-center">
          <span className="text-[19px]">subtotal</span>
          <span className="text-[23px]">${carts.subTotal}</span>
        </div>
        <div
          className={`text-gray-700 px-5 py-3 font-[500] text-[19px] tracking-tighter `}
        >
          CART {carts.quantity > 0 && `(${carts.quantity})`}
        </div>
        {carts.quantity > 0 ? (
          cartedItem
        ) : (
          <div>you dont have any item in cart </div>
        )}
        <div
          className={`bg-white p-5 flex items-center mt-5  ${
            carts.quantity > 0 ? "block" : "hidden"
          }`}
        >
          <Link to="/checkout/" className="flex w-full">
            <button className="bg-[orange] text-white outline-none rounded-[5px] font-[500] text-xl py-3 px-5  w-[100%]">
              Checkout {`($ ${carts.subTotal})`}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

// export async function cartLoader() {
//   console.log("hi");
//   try {
//     if (localStorage.getItem("cartId") !== null) {
//       console.log("inside");
//       const cartId = localStorage.getItem("cartId");
//       const cart = await api.get(`cart/`, {
//         params: { cart_id: cartId },
//       });
//       console.log(cart);
//       console.log(cart.data);
//       return cart.data;
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }
