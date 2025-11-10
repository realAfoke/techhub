import { useOutletContext } from "react-router-dom";

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
    <div>
      <div className="p-5">
        <section className="shadow-sm p-5 my-5 flex flex-col justify-center gap-2 bg-white rounded-2xl ">
          <div className="font-semibold text-lg">Dashboard</div>
          <span className="text-sm text-gray-500">
            Welcom back,{profileInfo.firstName}!
          </span>
        </section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          <section className="shadow-sm p-5 my-2 flex flex-col justify-center gap-2 bg-white rounded-2xl ">
            <div className="font-semibold text-sm text-gray-500">
              Total Order
            </div>
            <span className="text-2xl font-semibold">
              {profileInfo.order.length || "-"}
            </span>
          </section>
          <section className="shadow-sm p-5 my-2 flex flex-col justify-center gap-2 bg-white rounded-2xl ">
            <div className="font-semibold text-sm text-gray-500">
              Pending Order
            </div>
            <span className="text-2xl font-semibold">
              {order?.pendingOrder || "-"}
            </span>
          </section>
        </div>
      </div>
      <section className="shadow-sm p-5 my-5 flex flex-col justify-center gap-2 bg-white rounded-2xl overflow-wrap">
        <div className="flex justify-between">
          <span className="font-semibold text-sm">Recent Orders</span>
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
