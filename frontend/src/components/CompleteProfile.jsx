import { Form } from "react-router-dom";
import { api } from "../utils";
import { states } from "../utils";
import DropDown from "./DropDown";
export default function CompleteProfile() {
  //   const stateDropDown = states.map((s) => {
  //     return <DropDown state={s} />;
  //   });
  return (
    <>
      <div>
        <h2 className="font-bold text-2xl px-5 py-3">Shipping Details</h2>
        <Form className="bg-white px-5 py-6 flex flex-col gap-5">
          <div className="flex gap-5">
            <div className="flex flex-col gap-3">
              <label htmlFor="firtName">First Name</label>
              <input
                type="text"
                name="firtName"
                id="firtName"
                placeholder="Enter your first name"
                className="p-2 outline-none rounded-[3px] w-full border-b-1 border-black"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="firtName">First Name</label>
              <input
                type="text"
                name="firtName"
                id="firtName"
                placeholder="Enter your first Name"
                className="p-2 outline-none rounded-[3px] w-full border-b-1 border-black"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email">verify your email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="p-2 outline-none rounded-[3px] w-full border-b-1 border-black"
            />
          </div>
          <div>
            <DropDown DropDownName={"state"} values={states} />
          </div>
        </Form>
      </div>
    </>
  );
}
