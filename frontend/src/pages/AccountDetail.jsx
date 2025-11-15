import { Link, useOutletContext } from "react-router-dom";
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
  useEffect(() => {
    let intervalId;
    if (userDetail.isVerified === "pending") {
      intervalId = setInterval(async () => {
        const isVerified = await api.get("me");
        setUserDetail((prev) => ({
          ...prev,
          isVerified: isVerified.data.isVerified,
        }));
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [userDetail.isVerified]);
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
    <div className="p-4 py-3 flex flex-col md:mt-5">
      <section className="shadow-sm p-5 md:py-6 mb-2 flex items-center bg-orange-300 text-white rounded-2xl justify-between ">
        <div className="">
          <div className="font-semibold text-[16px]">Account Detail</div>
          <div className="text-[12px] text-white">
            Welcom back,{profileInfo.firstName}!
          </div>
        </div>
        <Link
          to="/"
          className="ring ring-white hidden rounded-md md:flex md:items-center"
        >
          <span className="text-[12px]  py-2 px-4">Continue Shopping</span>
        </Link>
      </section>
      <section className="bg-white shadow-[12px] p-6 rounded-[10px] my-2">
        <div className="flex justify-between">
          <div className="font-semibold">Account details</div>
          {userDetail.disabled && (
            <div
              className="ring ring-gray-200 px-3 rounded-[3px] py-2 text-[12px]"
              onClick={() =>
                setUserDetail((prev) => ({ ...prev, disabled: false }))
              }
            >
              Edit
            </div>
          )}
        </div>
        <div
          action=""
          className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 p-2"
        >
          <label htmlFor="firstName">
            <span className="text-[12px] text-gray-500 py-2 block">
              First Name
            </span>
            <input
              type="text"
              value={userDetail.firstName}
              disabled={userDetail.disabled}
              onChange={(e) =>
                setUserDetail((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              className="text-[12px] p-2 w-full rounded-[3px] bg-gray-50 ring ring-gray-300"
            />
          </label>
          <label htmlFor="lastName">
            <span className="text-[12px] text-gray-500 py-2 block">
              Last Name
            </span>
            <input
              type="text"
              value={userDetail.lastName}
              disabled={userDetail.disabled}
              onChange={(e) =>
                setUserDetail((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="text-[12px] p-2 w-full rounded-[3px] bg-gray-50 ring ring-gray-300"
            />
          </label>
          <label htmlFor="email">
            <span className="text-[12px] text-gray-500 py-2 block">Email</span>
            <div className="flex gap-5 items-center">
              <input
                type="email"
                value={userDetail.email}
                disabled={userDetail.disabled}
                onChange={(e) =>
                  setUserDetail((prev) => ({ ...prev, email: e.target.value }))
                }
                className="text-[12px] p-2 w-full rounded-[3px] bg-gray-50 ring ring-gray-300"
              />
              {!userDetail.isVerified && (
                <div
                  className="text-red-400 block px-2 ring ring-gray-200 bg-gray-50 rounded-[3px] text-[12px]"
                  onClick={async (e) => {
                    emailVerification();
                    e.currentTarget.textContent = "pending";
                    setUserDetail((prev) => ({
                      ...prev,
                      isVerified: "pending",
                    }));
                  }}
                >
                  Verify
                </div>
              )}
            </div>
          </label>
          <label htmlFor="phone">
            <span className="text-[12px] text-gray-500 py-2 block">Phone</span>
            <input
              type="tel"
              value={userDetail.phone}
              disabled={userDetail.disabled}
              onChange={(e) =>
                setUserDetail((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="text-[12px] p-2 w-full rounded-[5px] bg-gray-50 ring ring-gray-300"
            />
          </label>
          {!userDetail.disabled && (
            <div className="flex gap-5 mt-2">
              <button
                className="text-[14px] bg-orange-300 p-2 px-4 outline-none text-white rounded-md "
                onClick={async () => updateProfile()}
              >
                Save changess
              </button>
              <button
                className="rounded-[5px] border-none outline-none p-2 px-4 ring ring-gray-300 text-[12px] tracking-wide"
                onClick={() =>
                  setUserDetail((prev) => ({ ...prev, disabled: true }))
                }
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
