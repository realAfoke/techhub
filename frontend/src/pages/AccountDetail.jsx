import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../utils";
export default function AccountDetail() {
  let { profileInfo } = useOutletContext();
  const [userDetail, setUserDetail] = useState({
    firstName: profileInfo.firstName,
    lastName: profileInfo.lastName,
    email: profileInfo.email,
    phone: profileInfo.phone,
    isVerified: profileInfo.isVerified,
    disabled: true,
  });
  // useEffect(() => {
  //   let intervalId;
  //   if (!userDetail.isVerified) {
  //     intervalId = setInterval(async () => {
  //       const isVerified = await api.get("me");
  //       setUserDetail((prev) => ({
  //         ...prev,
  //         isVerified: isVerified.data.isVerified,
  //       }));
  //     }, 5000);
  //   }
  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //   };
  // }, [userDetail.isVerified]);
  async function emailVerification() {
    try {
      const reqVerif = await api.post("request-verification/", {});
    } catch (error) {
      console.error(error);
    }
  }

  async function updateProfile() {
    const cleanedData = Object.fromEntries(
      Object.entries(userDetail).filter(([_, v]) => v === "" || v === undefined)
    );
    try {
      const update = await api.patch("me/", cleanedData);
      setUserDetail((prev) => ({ ...prev, ...cleanedData }));
    } catch (error) {}
    console.log(cleanedData);
  }
  return (
    <div className="p-4 py-3 flex flex-col">
      <section className="shadow-sm p-6 my-5 flex flex-col justify-center gap-2 bg-white rounded-2xl ">
        <div className="font-semibold text-lg">Account Details</div>
        <span className="text-sm text-gray-500">
          Welcom back,{profileInfo.firstName}!
        </span>
      </section>
      <section className="bg-white shadow-sm p-6 rounded-[10px] my-2">
        <div className="flex justify-between">
          <div className="font-semibold">Account details</div>
          {userDetail.disabled && (
            <div
              className="ring ring-gray-200 px-3 rounded-[3px] py-2 text-sm"
              onClick={() =>
                setUserDetail((prev) => ({ ...prev, disabled: false }))
              }
            >
              Edit
            </div>
          )}
        </div>
        <div action="" className="flex flex-col gap-3 p-2">
          <label htmlFor="firstName">
            <span className="text-sm text-gray-500 py-2 block">First Name</span>
            <input
              type="text"
              value={userDetail.firstName}
              disabled={userDetail.disabled}
              onChange={(e) =>
                setUserDetail((prev) => ({ ...prev, fiest: e.target.value }))
              }
              className="p-2 w-full rounded-[3px] bg-gray-50 ring ring-gray-300"
            />
          </label>
          <label htmlFor="lastName">
            <span className="text-sm text-gray-500 py-2 block">Last Name</span>
            <input
              type="text"
              value={userDetail.lastName}
              disabled={userDetail.disabled}
              onChange={(e) =>
                setUserDetail((prev) => ({ ...prev, fiest: e.target.value }))
              }
              className="p-2 w-full rounded-[3px] bg-gray-50 ring ring-gray-300"
            />
          </label>
          <label htmlFor="email">
            <span className="text-sm text-gray-500 py-2 block">Email</span>
            <div className="flex gap-5 items-center">
              <input
                type="email"
                value={userDetail.email}
                disabled={userDetail.disabled}
                onChange={(e) =>
                  setUserDetail((prev) => ({ ...prev, fiest: e.target.value }))
                }
                className="p-2 w-full rounded-[3px] bg-gray-50 ring ring-gray-300"
              />
              {!userDetail.isVerified && (
                <div
                  className="text-red-400 block px-2 ring ring-gray-200 bg-gray-50 rounded-[3px]"
                  onClick={async (e) => {
                    emailVerification();
                    e.currentTarget.textContent = "pending";
                  }}
                >
                  Verify
                </div>
              )}
            </div>
          </label>
          <label htmlFor="phone">
            <span className="text-sm text-gray-500 py-2 block">Phone</span>
            <input
              type="tel"
              value={userDetail.phone}
              disabled={userDetail.disabled}
              onChange={(e) =>
                setUserDetail((prev) => ({ ...prev, fiest: e.target.value }))
              }
              className="p-2 w-full rounded-[5px] bg-gray-50 ring ring-gray-300"
            />
          </label>
          {!userDetail.disabled && (
            <button
              className="bg-orange-300 p-3 outline-none text-white rounded-md mt-2"
              onClick={async () => updateProfile()}
            >
              update
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
