import email from "../assets/email3.svg";
import Reset from "../assets/reset-icon.svg";
import { api } from "../utils";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function NewPassword() {
  const [password, setPassword] = useState({
    newPassWord: "",
    confrimPassword: "",
    status: false,
  });
  const location = useLocation();
  console.log(location);
  async function updatePassword() {
    try {
      if (password.newPassWord !== password.confrimPassword) {
        console.error("password does not match");
        return;
      }
      const req = await api.post(`${location.pathname}`, {
        newPassWord: password.newPassWord,
      });
      setPassword((prev) => ({ ...prev, status: true }));
    } catch (error) {}
  }
  return (
    <>
      {!password.status ? (
        <ResetUi
          updatePassword={updatePassword}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <PasswordResetSuccessfull />
      )}
    </>
  );
}

export function PasswordResetSuccessfull() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <p>
          your password has been successfully reseted you can now loging with
          your new password
        </p>
      </div>
    </>
  );
}

export function ResetUi({ updatePassword, password, setPassword }) {
  return (
    <>
      <div className="flex flex-col  justify-center h-screen px-8 gap-1 md:items-center">
        <div>
          <div className="flex justify-center">
            <img src={Reset} alt="" className="w-25 h-25 md:w-15 md:h-15" />
          </div>
          <div className="flex flex-col items-center py-5 md:py-2">
            <h3 className="font-bold text-3xl text-center md:text-xl">
              Reset Password
            </h3>
            <span className="text-[12px] text-center md:text-[10px]">
              Enter your new password
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-5 md:gap-0">
          <label htmlFor="newPass">
            <span className="block py-2 md:text-[12px]">New Password</span>
            <input
              type="password"
              className="p-3 block w-full rounded-[5px] ring ring-gray-300 md:py-1"
              value={password.newPassWord}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  newPassWord: e.target.value,
                }))
              }
            />
          </label>
          <label htmlFor="conPass">
            <span className="py-2 block md:text-[12px]">Confirm Password</span>
            <input
              type="password"
              className="p-3 block w-full rounded-[5px] ring ring-gray-300 md:py-1"
              value={password.confrimPassword}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  confrimPassword: e.target.value,
                }))
              }
            />
          </label>
          <button
            className="bg-orange-300 p-4 md:p-2 rounded-[5px] border-none outline-none text-white block md:mt-3 md:text-[12px]"
            onClick={() => updatePassword()}
          >
            Change Password
          </button>
        </div>
      </div>
    </>
  );
}
