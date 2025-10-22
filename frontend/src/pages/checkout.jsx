import { useOutletContext, useLoaderData, useNavigate } from "react-router-dom";
import { api } from "../utils";
import { useEffect } from "react";
import CompleteProfile from "../components/CompleteProfile";
import ShippingDetail from "../components/ShippingDetail";

export default function CheckOut() {
  // let { carts, isAuthenticated } = useOutletContext();
  const checkoutData = useLoaderData();
  const userInfo = checkoutData[0];
  const paymentMethod = checkoutData[1];
  const carts = checkoutData[2];
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (isAuthenticated === false) {
  //     navigate("/");
  //   }
  // }, [isAuthenticated]);
  const deliveryFee =
    carts.quantity > 5 ? carts.total_item * 350 : carts.total_item * 750;
  return (
    <div className=" bg-[#f0eded]">
      <div className="bg-white p-5 shadow-sm">
        <div className="flex gap-5 items-center">
          <span>backe</span>
          <span className="font-[600] text-[20px]">Place your order</span>
        </div>
        <span className="text-[10px]">
          By proceedin you automatically accepting the Terms & Conditions
        </span>
      </div>
      <div className="">
        <h3 className="p-5 py-3 font-[500] text-[gray]">ORDER SUMMARY</h3>
        <div className="bg-white p-5 py-3 shadow-sm *:py-1">
          <div className=" flex justify-between">
            <span>Item's total {`(${carts.total_item})`}</span>
            <span className="font-[500] text-[20px]">{`$${carts.total}`}</span>
          </div>
          <div className=" flex justify-between">
            <span>Delivery fees</span>
            <span
              className="font-[500] text-[18px
            ]"
            >
              {`$${deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-[700]">Total</span>
            <span className="font-[700] text-[23px]">
              ${carts.total + deliveryFee}
            </span>
          </div>
        </div>
      </div>
      <div>
        {checkoutData[0].is_verified || checkoutData.profile_complete_status ? (
          <ShippingDetail userInfo={userInfo} />
        ) : (
          <CompleteProfile userInfo={userInfo} />
        )}
      </div>
      <div>
        <h3>PAYMENT METHOD</h3>
      </div>
    </div>
  );
}

export async function checkOutLoader() {
  try {
    const endpoint = [
      api.get(`me/`),
      api.get("payment-method"),
      api.get("cart/"),
    ];
    const promises = await Promise.allSettled(endpoint);
    const succeedRequest = [];
    for (const promise of promises) {
      if (promise.status === "fulfilled") {
        succeedRequest.push(promise.value.data);
      } else {
        console.error(`Error: request failed with reason ${promise.reason}`);
      }
    }
    return succeedRequest;
  } catch (error) {
    console.log(error);
  }
}
