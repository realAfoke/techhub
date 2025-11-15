import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { api } from "../utils";

export default function ChangePassword() {
  let { profileInfo, order } = useOutletContext();
  const [userDetail, setUserDetail] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    currentError: false,
    newPassError: false,
    onSuccess: false,
  });
  // const [error, setError] = useState({ currentError: false, newPass: false });

  async function passwordUpdate() {
    if (userDetail.newPassword !== userDetail.confirmPassword) {
      console.log("hiiiiiii");
      setUserDetail((prev) => ({
        ...prev,
        newPassError: "password does not match",
      }));
      return;
    }
    try {
      const update = await api.put(`password-update/${profileInfo.id}/`, {
        currentPassword: userDetail.currentPassword,
        newPassword: userDetail.newPassword,
      });
      setUserDetail((prev) => ({ ...prev, onSuccess: update.data.message }));
    } catch (error) {
      setUserDetail((prev) => ({
        ...prev,
        currentError: error.response.data[0],
      }));
    }
  }
  return (
    <div className="p-4 py-3 flex flex-col h-full md:mt-5">
      <section className="shadow-sm p-5 md:py-6 mb-2 flex items-center bg-orange-300 text-white rounded-2xl justify-between ">
        <div className="">
          <div className="font-semibold text-[16px]">Change Password</div>
          <div className="text-[12px] text-white">
            Welcom back,{profileInfo.firstName}!
          </div>
        </div>
        <div className="ring ring-white hidden rounded-md md:flex md:items-center">
          <span className="text-[12px]  py-2 px-4">Continue Shopping</span>
        </div>
      </section>
      <section className="bg-white shadow-sm p-5 rounded-[10px] my-2 md:w-2/3">
        <div className="flex justify-between">
          <span className="font-semibold md:font-normal md:text-[14px]">
            Change Password
          </span>
          {userDetail.onSuccess && (
            <span className="text-[10px] text-green-500">
              {userDetail.onSuccess}
            </span>
          )}
        </div>

        <div action="" className="flex flex-col gap-3 p-1">
          <label htmlFor="firstName">
            <span className="text-sm text-gray-500 py-2 block md:text-[12px]">
              Current password
            </span>
            <input
              type="password"
              value={userDetail.currentPassword}
              onChange={(e) =>
                setUserDetail((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                  currentError: false,
                }))
              }
              className="p-2 w-full rounded-[5px] ring ring-gray-300"
            />
            {userDetail.currentError && (
              <span className="text-red-500 text-[10px]">
                {userDetail.currentError}
              </span>
            )}
          </label>
          <label htmlFor="lastName">
            <span className="text-sm text-gray-500 py-2 block md:text-[12px]">
              New password
            </span>
            <input
              type="password"
              value={userDetail.newPassword}
              onChange={(e) =>
                setUserDetail((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                  newPassError: false,
                }))
              }
              className="p-2 w-full rounded-[5px] ring ring-gray-300"
            />
            {userDetail.newPassError && (
              <span className="text-red-500 text-[10px]">
                {userDetail.newPassError}
              </span>
            )}
          </label>
          <label htmlFor="confimPass">
            <span className="text-sm text-gray-500 py-2 block md:text-[12px]">
              Confirm password
            </span>
            <input
              type="password"
              value={userDetail.confirmPassword}
              onChange={(e) =>
                setUserDetail((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                  newPassError: false,
                }))
              }
              className="p-2 w-full rounded-[5px] ring ring-gray-300"
            />
          </label>

          <div className="flex gap-4 my-2">
            <button
              className="bg-orange-400 p-2 text-center md:text-[12px] px-4 text-white rounded-[5px] "
              onClick={async () => passwordUpdate()}
            >
              Updat password
            </button>
            <button className="text-orange-400 md:text-[12px]">
              Forgot password?
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
