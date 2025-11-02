import { useRef } from "react";
export default function DropDown({
  DropDownName,
  options,
  value,
  handleOption,
}) {
  // console.log(value);
  const optionRef = useRef(null);
  const allValues = options?.map((v) => {
    return (
      <div key={v} className="">
        {v}
      </div>
    );
  });
  return (
    <>
      <div className={``}>
        <div className="py-2">{DropDownName}</div>
        <span
          className={` ${
            value.visible ? "border-none" : "border-1 border-black"
          }  py-1  px-2 rounded-[5px]`}
          onClick={() => handleOption((prev) => ({ ...prev, visible: true }))}
        >
          {value.value || "-----"}
        </span>
        <div
          ref={optionRef}
          className={`overflow-hidden  *:hover:bg-[orange] shadow-sm py-2 *:p-1 ${
            value?.visible
              ? "block max-h-[300px] overflow-scroll border-1 border-black"
              : "hidden"
          }`}
          onClick={(e) => {
            handleOption((prev) => ({
              ...prev,
              visible: !prev.visible,
              value: e.target.textContent,
              city: e.target.textContent,
            }));
          }}
        >
          {allValues}
        </div>
      </div>
    </>
  );
}
