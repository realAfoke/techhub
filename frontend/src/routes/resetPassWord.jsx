import { useState, useEffect } from "react";
import logo from "../assets/main-logo.png";
import { useLocation } from "react-router-dom";
import { api } from "../utils";
import email from "../assets/email3.svg";

export default function ResetPassword() {
  const location = useLocation();
  const { state } = location;
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [reset, setReset] = useState({ state: false, msg: "" });
  useEffect(() => {
    if (state?.emailOrPhone) {
      setEmailOrPhone(state?.emailOrPhone);
    }
  }, [emailOrPhone]);
  async function handleResetPasword() {
    console.log("hi");
    try {
      const req = await api.post("password-reset/", {
        email: emailOrPhone,
      });
      console.log(req.data);
      setReset((prev) => ({ ...prev, state: true, msg: req.data.message }));
    } catch (error) {}
  }
  return (
    <>
      {!reset.state ? (
        <ResetUi
          handleResetPasword={handleResetPasword}
          emailOrPhone={emailOrPhone}
          setEmailOrPhone={setEmailOrPhone}
        />
      ) : (
        <ResetMsg message={reset.msg} />
      )}
    </>
  );
}

export function ResetMsg({ message }) {
  return (
    <div className="flex flex-col items-center justify-center flex-wrap h-screen p-10 capitalize text-center antialiased">
      <div>
        <img src={email} alt="" className="w-25 h-25" />
      </div>
      <div className="">
        <h3 className="font-bold text-2xl py-2">Check your email!</h3>
        <span className="text-[14px]">{message}</span>
      </div>
    </div>
  );
}

export function ResetUi({ handleResetPasword, emailOrPhone, setEmailOrPhone }) {
  return (
    <div>
      <div className={`custom-bg flex flex-col justify-center p-10 px-5`}>
        <div className="flex justify-center">
          <img src={logo} alt="" className="w-[100px] md:w-10" />
        </div>
        <div className="flex flex-col items-center gap-1">
          {/* <h3 className="font-medium text-[18px] md:text-[16px] tracking-wide leading-8">
            Welcome to TechHub
          </h3> */}
          <span className="text-center text-[16px] md:text-[14px]">
            Type your e-mail or phone number to reset your password
          </span>
        </div>
        <div className="my-10 flex flex-col gap-10 md:gap-5">
          <div className="relative ">
            <label
              htmlFor="emailOrNumber"
              className="absolute top-[-13px] mx-4 px-2 bg-white text-orange-300"
            >
              Email*
            </label>
            <input
              type="email"
              name="emailOrPhone"
              //   inputMode=""
              id=""
              value={emailOrPhone}
              className={`p-5 md:p-2 flex items-center w-full outline-none border-2 border-orange-200 rounded-[5px] font-normal`}
              onChange={(e) =>
                // setEmailOrPhone((prev) => {
                //   const input = e.target.value.trim();
                //   let newValue;
                //   const isPhone = /^[0-9+]+$/.test(input);
                //   if (isPhone && input !== "") {
                //     newValue = {
                //       ...prev,
                //       value: input,
                //     };
                //   } else {
                //     newValue = { ...prev, value: input, type: "email" };
                //   }
                //   return newValue;
                // })
                setEmailOrPhone(e.target.value)
              }
            />
          </div>
          <div>
            <button
              className="w-full bg-orange-400 text-white p-3 md:p-2 rounded-[5px] text-center font-semibold text-[20px]md:text-[16px] tracking-widest"
              onClick={() => handleResetPasword()}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-7 mt-20 md:mt-0 md:max-w-100">
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
    </div>
  );
}
