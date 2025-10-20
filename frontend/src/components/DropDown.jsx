import { useEffect, useState } from "react";
export default function DropDown({ DropDownName, values }) {
  const [option, setOption] = useState({
    visible: false,
    value: "",
  });
  useEffect(() => {
    if (!option) {
      window.addEventListener("click", () => {
        console.log("hi");
        console.log("clicked");
        setOption((prev) => ({ ...prev, visible: false }));
      });
    }
  }, [option]);
  const allValues = values.map((v) => {
    return (
      <div key={v} className="">
        {v}
      </div>
    );
  });
  return (
    <>
      <div className={``}>
        <div className="py-1">{DropDownName}</div>
        <div
          className=""
          onClick={() => setOption((prev) => ({ ...prev, visible: true }))}
        >
          {option.value || "-----"}
        </div>
        <div
          className={`overflow-hidden *:hover:bg-[orange] shadow-sm py-2 *:p-1 ${
            option.visible ? "block max-h-[300px] overflow-scroll" : "hidden"
          }`}
          onClick={(e) =>
            setOption((prev) => ({
              ...prev,
              visible: false,
              value: e.target.textContent,
            }))
          }
        >
          {allValues}
        </div>
      </div>
    </>
  );
}
