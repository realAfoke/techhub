import { useState, useEffect, act } from "react";
import logo from "../assets/main-logo.png";
import { Form, Outlet, redirect, useLocation } from "react-router-dom";
import google from "../assets/google.svg";
import { useActionData } from "react-router-dom";
import hidden from "../assets/eye-lock.svg";
import visible from "../assets/eye-see.svg";
import { api } from "../utils";
export default function Create() {
  const location = useLocation();
  const action = useActionData();
  const [emailOrPhone, setEmailOrPhone] = useState({
    value: "",
    type: "text",
  });

  useEffect(() => {
    const clientDetail = JSON.parse(sessionStorage.getItem("userData"));
    if (clientDetail) {
      setEmailOrPhone((prev) => ({
        ...prev,
        value: clientDetail?.phone || clientDetail?.email,
        type: clientDetail.type,
      }));
    }
  }, []);
  return (
    <>
      <div
        className={`custom-bg flex flex-col items-center justify-center p-10 px-5 ${
          location.pathname.includes("password") ? "hidden" : "block"
        }`}
      >
        <div className="flex justify-center">
          <img src={logo} alt="" className="w-[100px] md:w-[40px]" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="font-[500] text-[18px] md:text-[16px] tracking-wide leading-8">
            Welcome to TechHub
          </h3>
          <span className="text-center text-[16px] md:text-[14px]">
            Type your e-mail or phone number to log in or create a techhub
            account
          </span>
        </div>
        <Form
          method="post"
          action="."
          className="my-10 flex flex-col gap-10 md:gap-5"
        >
          <div className="relative ">
            <label
              htmlFor="emailOrNumber"
              className="absolute top-[-13px] mx-4 px-2 bg-white text-orange-300"
            >
              Email or Phone*
            </label>
            <span
              className={`absolute top-5.5 px-5 text-[orange] font-[400] ${
                emailOrPhone.type === "tel" ? "block" : "hidden"
              }`}
            >
              +234 NG
            </span>
            <input
              type="text"
              name="emailOrPhone"
              inputMode=""
              id=""
              value={emailOrPhone.value}
              className={`p-5 md:p-2 flex items-center w-full outline-none border-2 border-orange-200 rounded-[5px] font-[400] ${
                emailOrPhone.type === "tel" ? "pl-22" : ""
              }`}
              onChange={(e) =>
                setEmailOrPhone((prev) => {
                  const input = e.target.value.trim();
                  let newValue;
                  const isPhone = /^[0-9+]+$/.test(input);
                  if (isPhone && input !== "") {
                    newValue = {
                      ...prev,
                      value: input,
                      type: "tel",
                    };
                  } else {
                    newValue = { ...prev, value: input, type: "email" };
                  }
                  return newValue;
                })
              }
            />
            {action && (
              <div className="absolute bottom-[-6rem] w-[50%] bg-white ring-1 ring-red-500  p-2 text-red-500">
                <span>{action}</span>
              </div>
            )}
          </div>
          <div>
            <button className="w-full bg-orange-400 text-white p-3 md:p-2 rounded-[5px] text-center font-[600] text-[20px]md:text-[16px] tracking-widest">
              Continue
            </button>
            <div className="flex flex-col items-center px-[3rem] text-[14px] md:text-[12px] mt-3">
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
        <div className="flex flex-col gap-7 mt-[5rem] md:mt-[0rem] md:max-w-[25rem]">
          <button className="p-4 md:p-2 grid grid-cols-[50px_1fr] font-[500] outline-none w-full rounded-[5px] border-1 border-gray-300 ">
            <img src={google} alt="" className="w-[20px]" />
            <span className="text-center text-[18x]">Login with Google</span>
          </button>
          <div className="flex flex-col gap-5">
            <span className="text-center md:text-[12px]">
              For further support, you may visit the Help Center or contact our
              customer service team.
            </span>
            <div className="flex justify-center">
              <span className="font-bold">TECHHUB</span>
              <img src={logo} alt="" className="w-[25px]" />
            </div>
          </div>
        </div>
      </div>
      <Outlet context={{ emailOrPhone }} />
    </>
  );
}

export async function checkAccountAction({ request }) {
  const data = await request.formData();
  const userDetail = data.get("emailOrPhone");
  const isPhone = /^[0-9+]+$/.test(userDetail);
  const userData = {};
  if (isPhone) {
    userData["phone"] = userDetail.startsWith("0")
      ? userDetail.slice(1)
      : userDetail;
  } else {
    userData["email"] = userDetail;
    const isValidated = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetail);
    if (!isValidated) {
      return `Please include an '@' in the email address.'${userDetail}' is missing an '@' .`;
    }
  }
  try {
    const emailOrNumber = await api.get(`check-user/`, {
      params: { ...userData },
    });
    if (emailOrNumber.data === "user exist") {
      userData["type"] = isPhone ? "tel" : "email";
      sessionStorage.setItem("userData", JSON.stringify(userData));
      return redirect("../login");
    } else {
      console.log(userData);
      return redirect("password/");
    }
  } catch (error) {
    console.error(error);
  }
}
