import logo from "../assets/main-logo.png";
import { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";
import hidden from "../assets/eye-lock.svg";
import visible from "../assets/eye-see.svg";
import { api } from "../utils";
export default function Login() {
  const navigate = useNavigate();
  const [userPassword, setUserPassword] = useState("");
  const [userEmailOrPhone, setUserEmailOrPhone] = useState({
    value: "",
    inputState: false,
  });
  const [showPassword, setShowPassword] = useState({
    visibility: hidden,
    type: "password",
  });

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
      const loginDetail = userData;
      console.log(loginDetail);
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
      <div className="pt-[5rem] bg-[#ffffff]">
        <div className="flex flex-col items-center gap-1">
          <img src={logo} alt="" className="w-[100px]" />

          <h4 className="font-[600] text-[20px]">Welcome back</h4>
          <span>Log back inot your techhub account</span>
        </div>
        <Form
          className="p-5 py-15 flex flex-col gap-8"
          method="post"
          action="."
        >
          <div className="relative">
            <span
              className={`text-[orange] absolute right-2 top-4 px-2 font-[500] text-[18px] ${
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
                userPassword.length > 0 && userEmailOrPhone.value.length > 0
                  ? "text-white bg-[orange]"
                  : "text-[gray] bg-[#80808060]"
              }`}
              disabled={
                userPassword.length === 0 || userEmailOrPhone.value === 0
              }
              //   onClick={() => console.log("hi")}
            >
              Login
            </button>
            <button className="text-[orange] p-3 text-center w-full font-[600] text-[17px]">
              Forgot you pasword ?
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

export async function loginAction({ request }) {
  const data = await request.formData();
  const userData = { password: data.get("password") };
  userData[/@/.test(data.get("emailOrPhone")) ? "email" : "phone"] =
    data.get("emailOrPhone");
  try {
    const login = await api.post("login/", { ...userData });
    console.log(login.data);
  } catch (error) {}
}
