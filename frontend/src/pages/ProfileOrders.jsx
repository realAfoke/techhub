import { useOutletContext, Link } from "react-router-dom";
export default function ProfileOrder() {
  let { profileInfo } = useOutletContext();
  const orderHistories = profileInfo.order.map((history) => {
    return (
      <li key={history.id} className="text-[12px]">
        {history.orderId}
      </li>
    );
  });
  return (
    <div className="p-5 flex flex-col -mt-1 md:mt-3">
      <section className="shadow-sm p-5 md:py-6 mb-2 flex items-center bg-orange-300 text-white rounded-2xl justify-between ">
        <div className="">
          <div className="font-semibold text-[16px]">Order History</div>
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
      <section className="shadow-sm p-5 md:py-6 flex flex-col justify-center gap-2 bg-white rounded-2xl ">
        <div className="flex justify-between">
          <span className="font-semibold text-sm ">Recent Orders</span>
        </div>
        {profileInfo.order ? (
          <ul className="flex flex-col gap-2">{orderHistories}</ul>
        ) : (
          <span className="text-sm font-semibold text-center py-20">
            you dont have any order at the moment
          </span>
        )}
      </section>
    </div>
  );
}
