import { useOutletContext } from "react-router-dom";
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
    <div className="p-5 flex flex-col">
      <section className="shadow-sm p-5 my-5 flex flex-col justify-center gap-2 bg-white rounded-2xl ">
        <div className="font-semibold text-lg">Order History</div>
        <span className="text-sm text-gray-500">
          Welcom back,{profileInfo.firstName}!
        </span>
      </section>
      <section className="shadow-sm p-5 flex flex-col justify-center gap-2 bg-white rounded-2xl ">
        <div className="flex justify-between">
          <span className="font-semibold text-sm">Recent Orders</span>
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
