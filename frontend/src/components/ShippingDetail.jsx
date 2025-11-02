export default function ShippingDetail({ userInfo }) {
  return (
    <div>
      <h3 className="p-5 py-3 font-[500] text-[gray] md:text-[14px]">
        CUSTOMER ADDRESS
      </h3>
      <div className="bg-white flex flex-col p-5 py-2">
        <span className="font-[500] tracking-wide md:text-[14px]">{`${userInfo.firstName} ${userInfo.lastName}`}</span>
        <span className="text-gray-700 tracking-wide md:text-[12px]">
          {userInfo.address}
        </span>
      </div>
    </div>
  );
}
