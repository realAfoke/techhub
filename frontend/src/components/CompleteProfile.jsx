import { Form } from "react-router-dom";
import { api } from "../utils";
import { states, cities } from "../utils";
import { useEffect, useState } from "react";
import DropDown from "./DropDown";
export default function CompleteProfile({ userInfo }) {
  const [spinner, setSpinner] = useState({
    isVerified: userInfo.is_verified,
    status: false,
  });
  const [formData, setFormData] = useState({
    firstName: userInfo.first_name,
    lastName: userInfo.last_name,
    email: userInfo.email,
    address: userInfo.address,
  });
  const [option, setOption] = useState({
    visible: false,
    value: userInfo.state,
    city: userInfo.state,
  });
  const [cityOption, setCityOption] = useState({
    visible: false,
    value: "",
    cities: cities.find(
      (s) => s.state.toLocaleLowerCase() === option?.city.toLocaleLowerCase()
    ).city,
  });
  useEffect(() => {
    setCityOption((prev) => ({
      ...prev,
      value: "",
      visible: false,
      cities: cities.find(
        (s) => s.state.toLocaleLowerCase() === option?.city.toLocaleLowerCase()
      ).city,
    }));
  }, [option]);
  //Email Verification function
  async function emailVerification() {
    try {
      const reqVerif = await api.post("request-verification/", {});
    } catch (error) {
      console.error(error);
    }
  }

  //Confirm Verification / Verification Check
  useEffect(() => {
    let intervalId;
    if (spinner.status) {
      intervalId = setInterval(async () => {
        const isVerified = await api.get("me");
        if (isVerified.data?.is_verified) {
          setSpinner((prev) => ({
            ...prev,
            status: false,
            isVerified: isVerified.data.is_verified,
          }));
        }
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [spinner.status]);

  async function proceed() {
    try {
      const update = await api.patch("me/", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        state: option.value,
        city: cityOption.value,
        address: formData.address,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <div>
        <h2 className="font-bold text-2xl px-5 py-3">Shipping Details</h2>
        <form className="bg-white px-5 py-6 flex flex-col gap-5">
          <div className="flex gap-5">
            <div className="flex flex-col gap-3">
              <label htmlFor="firtName">First Name</label>
              <input
                type="text"
                name="firtName"
                id="firtName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                    profileCompleteStatus: prev.profileCompleteStatus + 10,
                  }))
                }
                placeholder="Enter your first name"
                className="p-2 outline-none w-full border-b-1 border-black"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="firtName">First Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                placeholder="Enter your last Name"
                className="p-2 outline-none w-full border-b-1 border-black"
              />
            </div>
          </div>
          <div className="relative">
            <div className="flex justify-between">
              <label htmlFor="email">email</label>
              <span
                onClick={async () => {
                  setSpinner((prev) => ({ ...prev, status: "loading" }));
                  await emailVerification();
                }}
                className={`${spinner.status ? "hidden" : "block"} ${
                  spinner.isVerified ? "text-green-500" : "text-red-500"
                }`}
              >
                {spinner.isVerified ? "Verified" : "Verify"}
              </span>
            </div>
            {spinner.status && (
              <span className="h-[20px] w-[20px] block border-b-1 border-l-1 border-black rounded-full animate-spin absolute right-4"></span>
            )}
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="p-2 outline-none w-full border-b-1 border-black"
              placeholder="enter your email"
            />
          </div>
          <div className="flex flex-col gap-3">
            <DropDown
              DropDownName={"State"}
              options={states}
              value={option}
              handleOption={setOption}
            />
            <DropDown
              DropDownName={"City"}
              options={cityOption.cities}
              value={cityOption}
              handleOption={setCityOption}
            />
          </div>
          <div>
            <textarea
              name="address"
              id=""
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              className=" border-1 border-black w-full h-[100px] rounded-[5px] "
            ></textarea>
          </div>
        </form>
        <button onClick={async () => await proceed()}>submit</button>
      </div>
    </>
  );
}
