import { useOutletContext } from "react-router-dom";
export default function Address() {
  let { profileInfo } = useOutletContext();
  return (
    <div className="flex flex-col p-5">
      <section className="shadow-sm p-5 my-5 flex flex-col justify-center gap-2 bg-white rounded-2xl ">
        <div className="font-semibold text-lg">Saved Addresses</div>
        <span className="text-sm text-gray-500">
          Welcom back,{profileInfo.firstName}!
        </span>
      </section>
      <section className="shadow bg-white rounded-2xl p-4">
        <div className="flex justify-between my-2">
          <div>Saved addresses</div>
          <div className="py-1 text-[12px] px-2 ring ring-gray-200 bg-orange-400 text-white rounded-[5px]">
            Add new address
          </div>
        </div>
        <div>
          <div className="bg-orange-200 p-2 rounded-[5px] relative mt-5">
            <div>{profileInfo.address}</div>
            <span className="text-green-400 absolute top-0 right-0 px-2 text-[12px]">
              active
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
