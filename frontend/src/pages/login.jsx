import logo from "../assets/main-logo.png";
import { useState, useEffect } from "react";
import { Form, redirect, useNavigate, useActionData } from "react-router-dom";
import hidden from "../assets/eye-lock.svg";
import visible from "../assets/eye-see.svg";
import { api } from "../utils";
export default function Login() {
  const actionDta = useActionData();
  const navigate = useNavigate();
  const [userPassword, setUserPassword] = useState({
    value: "",
    error: "",
  });
  const [userEmailOrPhone, setUserEmailOrPhone] = useState({
    value: "",
    inputState: false,
  });
  const [showPassword, setShowPassword] = useState({
    visibility: hidden,
    type: "password",
  });

  useEffect(() => {
    console.log("errors:", actionDta?.nonFieldErrors[0]);
    setUserPassword((prev) => ({
      ...prev,
      error: actionDta?.nonFieldErrors[0],
    }));
  }, [actionDta]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
      const loginDetail = userData;
      const realDetail =
        loginDetail.type === "tel"
          ? `+234 ${loginDetail.phone.slice(0, 3)} ${loginDetail.phone.slice(
              3,
              6
            )} ${loginDetail.phone.slice(6)}`
          : loginDetail.email;

      setUserEmailOrPhone((prev) => ({
        ...prev,
        value: realDetail,
        inputState: true,
      }));
    }
  }, []);
  return (
    <>
      <div className="pt-20 bg-[#ffffff] flex flex-col md:items-center justify-center">
        <div className="flex flex-col items-center gap-1">
          <img
            src={logo}
            alt=""
            className="w-[100px] md:w-10
          "
          />

          <h4 className="font-medium text-[20px] md:text-[16px]">
            Welcome back
          </h4>
          <span className=" md:text-[12px]">
            Log back inot your techhub account
          </span>
        </div>
        <Form
          className="p-5 py-15 flex flex-col gap-8 md:gap-4 md:py-10"
          method="post"
          action="."
        >
          <div className="relative">
            <span
              className={`text-[orange] absolute right-2 top-4 px-2 font-normal text-[18px] md:text-[14px] md:top-2  ${
                userEmailOrPhone.value ? "block" : "hidden"
              }`}
              onClick={() =>
                navigate("../create-account", {
                  state: {
                    clientDetail: JSON.parse(
                      sessionStorage.getItem("userData")
                    ),
                  },
                })
              }
            >
              Edit
            </span>
            <input
              type="text"
              value={userEmailOrPhone.value}
              name="emailOrPhone"
              readOnly={userEmailOrPhone.inputState}
              placeholder="Email or password"
              onChange={(e) =>
                setUserEmailOrPhone((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              className={`p-4 ${
                userEmailOrPhone.inputState
                  ? "bg-[#80808060] border-none"
                  : "bg-white border border-gray-200"
              } rounded-md font-normal outline-none w-full md:py-2 md:text-[12px]`}
            />
          </div>
          <div className="relative">
            <img
              src={showPassword.visibility}
              alt=""
              className="w-[25px] absolute right-3 top-4 md:top-2 bg-white p-1"
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
              value={userPassword.value}
              onChange={(e) =>
                setUserPassword((prev) => {
                  return { ...prev, value: e.target.value, error: "" };
                })
              }
              placeholder="Password"
              className={`p-4  rounded-md font-normal outline-none w-full border border-gray-200 md:py-2 md:text-[14px] ${
                userPassword.error ? "border-red-500" : ""
              }`}
            />
            {userPassword.error && (
              <span className="text-red-500 text-[15px]">
                {userPassword.error}
              </span>
            )}
          </div>
          <div>
            <button
              className={`py-4 bg-[#80808060] font-normal w-full rounded-md text-[18px] md:text-[14px] tracking-wider} md:py-1 ${
                userPassword.value.length > 0 &&
                userEmailOrPhone.value.length > 0
                  ? "text-white bg-[orange]"
                  : "text-[gray] bg-[#80808060]"
              }`}
              disabled={
                userPassword.value.length === 0 || userEmailOrPhone.value === 0
              }
            >
              Login
            </button>
            <button
              className="text-[orange] p-3 md:pt-2 text-center w-full font-semibold text-[17px] md:text-[12px]"
              onClick={(e) => {
                e.preventDefault();
                navigate("/reset-password", {
                  state: { emailOrPhone: userEmailOrPhone.value },
                });
              }}
            >
              Forgot you pasword ?
            </button>
          </div>
        </Form>
        <div className="flex flex-col gap-5 px-4 pt-12 md:pt-0 md:gap-2">
          <span className="text-center md:text-[12px] md:max-w-[300px]">
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

export async function loginAction({ request }) {
  const data = await request.formData();
  const userData = { password: data.get("password") };
  if (/@/.test(data.get("emailOrPhone"))) {
    userData["email"] = data.get("emailOrPhone");
  } else {
    userData["phone"] = data.get("emailOrPhone").slice(4).replaceAll(" ", "");
  }
  try {
    const login = await api.post("login/", { ...userData });
    sessionStorage.removeItem("userData");
    return redirect("/");
  } catch (error) {
    return error.response.data;
  }
}
