import logo from "../assets/main-logo.png";
import { useState, useEffect } from "react";
import {
  Form,
  redirect,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import hidden from "../assets/eye-lock.svg";
import visible from "../assets/eye-see.svg";
import { api } from "../utils";

export default function Login() {
  const { emailOrPhone } = useOutletContext();
  const loginDetail = emailOrPhone;
  let signUpContactt;
  if (loginDetail.type === "tel") {
    let trimNumber = loginDetail.value.startsWith("0")
      ? loginDetail.value.slice(1)
      : loginDetail.value;
    signUpContactt = `+234 ${trimNumber.slice(0, 3)} ${trimNumber.slice(
      3,
      6
    )} ${trimNumber.slice(6)}`;
  } else {
    signUpContactt = loginDetail.value;
  }
  const navigate = useNavigate();
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    visibility: hidden,
    type: "password",
  });
  return (
    <>
      <div className="pt-[5rem] bg-[#ffffff]">
        <div className="flex flex-col items-center gap-1">
          <img src={logo} alt="" className="w-[100px]" />

          <h4 className="font-[600] text-[20px]">Password</h4>
          <span>Continue With Account Setup</span>
        </div>
        <Form
          className="p-5 py-15 flex flex-col gap-8"
          method="post"
          action="."
        >
          <div className="relative">
            <span
              className={`text-[orange] absolute right-2 top-4 px-2 font-[500] text-[18px] ${
                emailOrPhone.value ? "block" : "hidden"
              }`}
              onClick={() => navigate("../")}
            >
              Edit
            </span>
            <input
              type="text"
              value={signUpContactt}
              name="emailOrPhone"
              readOnly
              placeholder="Email or password"
              className={`p-4 ${
                emailOrPhone.value
                  ? "bg-[#80808060] border-none"
                  : "bg-white border-1 border-black"
              } rounded-[6px] font-[600] outline-none w-full`}
            />
          </div>
          <div className="relative">
            <img
              src={showPassword.visibility}
              alt=""
              className="w-[25px] absolute right-3 top-4 "
              onClick={(e) =>
                setShowPassword((prev) =>
                  prev.type === "password"
                    ? { ...prev, visibility: visible, type: "text" }
                    : { ...prev, visibility: hidden, type: "password" }
                )
              }
            />
            <input
              type={showPassword.type}
              id=""
              name="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Password"
              className={`p-4  rounded-[6px] font-[600] outline-none w-full border-1 border-black `}
            />
          </div>
          <div>
            <button
              className={`py-4 bg-[#80808060] font-[700] w-full rounded-[6px] text-[18px] tracking-wider} ${
                userPassword.length > 0 && emailOrPhone.value.length > 0
                  ? "text-white bg-[orange]"
                  : "text-[gray] bg-[#80808060]"
              }`}
              disabled={userPassword.length === 0 || emailOrPhone.value === 0}
            >
              Login
            </button>
          </div>
        </Form>
        <div className="flex flex-col gap-5 px-4 pt-[3rem]">
          <span className="text-center p-">
            For further support, you may visit the Help Center or contact our
            customer service team.
          </span>
          <div className="flex justify-center">
            <span className="font-bold">TECHHUB</span>
            <img src={logo} alt="" className="w-[25px]" />
          </div>
        </div>
      </div>
    </>
  );
}

export async function createAction({ request }) {
  const data = await request.formData();
  const userData = { password: data.get("password") };
  if (/@/.test(data.get("emailOrPhone"))) {
    userData["email"] = data.get("emailOrPhone");
  } else {
    userData["phone"] = data.get("emailOrPhone").slice(4).replaceAll(" ", "");
  }
  try {
    const create = await api.post("sign-up/", { ...userData });
    sessionStorage.removeItem("userData");
    const autoLogin = await api.post("login/", { ...userData });
    localStorage.setItem("accessToken", autoLogin.data.access);
    localStorage.setItem("refreshToken", autoLogin.data.refresh);
    // return redirect("/");
  } catch (error) {
    console.error(error);
  }
}
