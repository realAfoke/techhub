import { Form } from "react-router-dom";
import { api } from "../utils";
import { states } from "../utils";
import { useEffect, useState } from "react";
import DropDown from "./DropDown";
export default function CompleteProfile({
  formData,
  cityOption,
  option,
  userInfo,
  setOption,
  setCityOption,
  setFormData,
  error,
}) {
  const [spinner, setSpinner] = useState({
    isVerified: userInfo.isVerified,
    status: false,
  });

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

  return (
    <>
      <div>
        <h2 className="font-bold text-2xl px-5 py-3 md:text-[14px]">
          Shipping Details
        </h2>
        <form className="bg-white px-5 pb-6 flex flex-col gap-5">
          {error && <span className="text-red-500 py-0">{error}</span>}

          <div className="flex gap-5 py-3">
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
                className="p-2 outline-none w-full border-b border-black"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="firtName">Last Name</label>
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
                className="p-2 outline-none w-full border-b border-black"
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
              <span className="h-5 w-5 block border-b border-l border-black rounded-full animate-spin absolute right-4"></span>
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
              className="p-2 outline-none w-full border-b border-black"
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
              className=" border border-black w-full h-[100px] rounded-[5px] p-3 py-2"
            ></textarea>
          </div>
        </form>
        {/* <button onClick={async () => await proceed()}>submit</button> */}
      </div>
    </>
  );
}
