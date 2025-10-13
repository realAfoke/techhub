import { useState } from "react";
import logo from "../assets/main-logo.png";
import { Form } from "react-router-dom";
export default function Create() {
  const [emailOrNumber, setEmialOrNumber] = useState("");
  return (
    <>
      <div className="bg-white p-10 px-5">
        <div className="flex justify-center">
          <img src={logo} alt="" className="w-[100px]" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="font-[700] text-[18px] tracking-wide leading-8">
            Welcome to TechHub
          </h3>
          <span className="text-center text-[16px]">
            Type your e-mail or phone number to log in or create a techhub
            account
          </span>
        </div>
        <Form method="post" action="." className="mt-10 flex flex-col gap-10">
          <div className="relative ">
            <label
              htmlFor="emailOrNumber"
              className="absolute top-[-13px] mx-4 px-2 bg-white text-[orange]"
            >
              Email or Number*
            </label>
            <span
              className={`absolute top-5.5 px-5 text-[orange] font-[400] ${
                Number(emailOrNumber) ? "block" : "hidden"
              }`}
            >
              +234 NG
            </span>
            <input
              type="text"
              name="emailOrPhone"
              id=""
              value={emailOrNumber}
              className={`p-5 flex items-center w-full outline-none border-2 border-[orange] rounded-[5px] font-[400] ${
                Number(emailOrNumber) ? "pl-22 " : ""
              }`}
              onChange={(e) => setEmialOrNumber((prev) => e.target.value)}
            />
          </div>
          <div>
            <button className="w-full bg-[orange] text-white p-5 rounded-[5px] text-center font-[500] text-[20px] tracking-wide">
              Continue
            </button>
            <div className="flex flex-col items-center px-[3rem] text-[14px] mt-3">
              <span className="text-center">
                By continuing you agree to techhub's
              </span>
              <a
                href=""
                className="text-center px-[3rem] underline decoration-[orange] text-[orange]"
              >
                Terms ans Condition Privacy Policy
              </a>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export async function createAction({ request }) {
  const data = await request.formData();
  const email = data.get("emailOrPhone");
  console.log(email);
}
