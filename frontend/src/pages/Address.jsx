import { useOutletContext, Link } from "react-router-dom";
export default function Address() {
  let { profileInfo } = useOutletContext();
  return (
    <div className="flex flex-col p-5 md:mt-4 -mt-2">
      <section className="shadow-sm p-5 md:py-6 mb-2 flex items-center bg-orange-300 text-white rounded-2xl justify-between ">
        <div className="">
          <div className="font-semibold text-[16px]">Address</div>
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
      <section className="shadow bg-white rounded-2xl p-4">
        <div className="flex justify-between my-2">
          <div className="text-[12px] tracking-tighter font-semibold">
            Saved addresses
          </div>
          <div className="py-1 text-[12px] px-2 ring ring-gray-200 bg-orange-400 text-white rounded-[5px]">
            Add new address
          </div>
        </div>
        <div className="min-h-30">
          {profileInfo.address ? (
            <div className="p-2 rounded-[5px] relative mt-5 text-[14px]">
              <div>{profileInfo.address}</div>
              <span className="text-green-400 absolute top-0 right-0 px-2 text-[12px]">
                active
              </span>
            </div>
          ) : (
            <div>No saved address yet</div>
          )}
        </div>
      </section>
    </div>
  );
}
