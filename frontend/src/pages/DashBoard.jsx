import PendingIcon from "../assets/pending.svg?react";
import { useOutletContext, Link } from "react-router-dom";
import OrderIcon from "../assets/total-order.svg?react";

export default function DashBoard() {
  let { profileInfo, order } = useOutletContext();
  order = {};
  order.total = 20;
  const orderHistories = profileInfo.order.map((history) => {
    return (
      <li key={history.id} className="text-[12px]">
        {history.orderId}
      </li>
    );
  });
  return (
    <div className="p-5 md:p-0 mt-8 flex flex-col">
      <div className=" ">
        <section className="shadow-sm p-5 md:py-6 mb-2 flex items-center bg-orange-300 text-white rounded-2xl justify-between ">
          <div className="">
            <div className="font-semibold text-[16px]">Dashboard</div>
            <div className="text-[12px] text-white">
              Welcom back,{profileInfo.firstName}!
            </div>
          </div>
          <Link
            to="/"
            className="ring ring-white hidden rounded-md md:flex md:items-center"
          >
            <span className="text-[12px]  py-2 px-4">Continue Shopping</span>
          </Link>
        </section>
        <div className="gap-2 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <section className="shadow-sm p-5 md:py-5 my-2 flex justify-between items-center gap-2 bg-white rounded-2xl ">
            <div>
              <div className="font-semibold md:font-normal text-sm text-gray-500">
                Total Order
              </div>
              <span className="text-2xl md:font-light">
                {profileInfo.order.length || "-"}
              </span>
            </div>
            <div>
              <OrderIcon fill="orange" className="w-6 h-6" />
            </div>
          </section>
          <section className="shadow-sm p-5 md:py-2 my-2 flex justify-between items-center gap-2 bg-white rounded-2xl ">
            <div>
              <div className="font-semibold md:font-normal text-sm text-gray-500">
                Pending Order
              </div>
              <span className="text-2xl font-semibold md:font-light">
                {order?.pendingOrder || "-"}
              </span>
            </div>
            <PendingIcon color="orange" className="w-6 h-6" />
          </section>
        </div>
      </div>
      <section className="shadow-sm p-5 my-5 md:my-0 md:py-5 flex flex-col justify-center gap-2 bg-white rounded-2xl overflow-wrap">
        <div className="flex justify-between">
          <span className="font-semibold md:font-normal text-sm">
            Recent Orders
          </span>
          {profileInfo.order.length > 5 && (
            <span className="text-orange-500 text-sm">view All Orders</span>
          )}
        </div>
        {profileInfo.order ? (
          <ul
            className="list-disc flex flex-col gap-3 px-4 py-3
          "
          >
            {orderHistories}
          </ul>
        ) : (
          <span className="text-sm font-semibold text-center py-20">
            you dont have any order at the moment
          </span>
        )}
      </section>
    </div>
  );
}
