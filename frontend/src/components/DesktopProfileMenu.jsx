import { Link, NavLink } from "react-router-dom";
import ProfileIcon from "../assets/profile-icon.svg?react";
import OrderIcon from "../assets/total-order.svg?react";
import DashboardIcon from "../assets/home.svg?react";
import { useEffect, useState } from "react";
import Location from "../assets/location.svg?react";

export default function DesktopProfileMenu({ initails, profileInfo }) {
  let selected = "white";
  let general = "green";
  const [iconColorId, setIconColorId] = useState(1);

  return (
    <>
      <div className="bg-white shadow-md overflow-hidden  flex flex-col gap-3 py-4 my-8 rounded-2xl antialiased text-[14px]">
        <div className="flex px-5 items-center gap-3 pt-2 pb-5 text-black border-b border-red-500">
          <div className="uppercase bg-orange-100 text-orange-500 rounded-full font-bold text-lg h-12 w-12 justify-center">
            <span className="p-2 block ml-2.5 mt-0.5">{initails}</span>
          </div>
          <div>
            <div>Hi,</div>
            <div className="font-medium capitalize">{profileInfo.lastName}</div>
          </div>
        </div>
        <ul className="list-none flex flex-col gap-5 px-5  pt-3 pb-10 border-b border-red-500 ">
          <li
            className="*:flex *:gap-1 *:items-center *:hover:bg-gray-50 *:hover:rounded-[5px] *:hover:py-2 *:hover:px-3"
            onClick={() => setIconColorId(1)}
          >
            <NavLink
              to="."
              end
              className={({ isActive, isPending }) =>
                isActive
                  ? "bg-orange-300 block px-3 py-2 rounded-[5px] text-white"
                  : isPending
                  ? ""
                  : ""
              }
            >
              <DashboardIcon
                className="w-4 h-4 text-gray-700"
                fill={iconColorId === 1 ? "white" : "orange"}
              />

              <span>Dashboard</span>
            </NavLink>
          </li>
          <li
            className="*:flex *:gap-1 *:items-center *:hover:bg-gray-50 *:hover:rounded-[5px] *:hover:py-2 *:hover:px-3"
            onClick={() => setIconColorId(2)}
          >
            <NavLink
              to="order"
              className={({ isActive, isPending }) =>
                isActive
                  ? "bg-orange-300 block px-3 py-2 rounded-[5px] text-white"
                  : isPending
                  ? ""
                  : ""
              }
            >
              <OrderIcon
                className="w-4 h-4"
                fill={iconColorId === 2 ? "white" : "orange"}
              />
              <span>Order History</span>
            </NavLink>
          </li>
          <li
            className="*:flex *:gap-1 items-center *:hover:bg-gray-50 *:hover:rounded-[5px] *:hover:py-2 *:hover:px-3"
            onClick={() => setIconColorId(3)}
          >
            <NavLink
              to="account-detail"
              className={({ isActive, isPending }) =>
                isActive
                  ? "bg-orange-300 block px-3 py-2 rounded-[5px] text-white"
                  : isPending
                  ? ""
                  : ""
              }
            >
              <ProfileIcon
                className="w-4 h-4"
                fill={iconColorId === 3 ? "white" : "orange"}
              />
              <span>Account Detail</span>
            </NavLink>
          </li>
          <li
            className="*:flex *:items-center *:gap-1 *:hover:bg-gray-50 *:hover:py-2 *:hover:px-3 *:hover:rounded-[5px]"
            onClick={() => setIconColorId(4)}
          >
            <NavLink
              to="address"
              className={({ isActive, isPending }) =>
                isActive
                  ? "bg-orange-300 block px-3 py-2 rounded-[5px] text-white"
                  : isPending
                  ? ""
                  : ""
              }
            >
              <Location
                color={iconColorId === 4 ? "white" : "orange"}
                className="w-4 h-4"
              />
              Saved Address
            </NavLink>
          </li>
          <li
            className="*:flex *:items-center *:gap-1 *:hover:bg-gray-50 *:hover:py-2 *:hover:px-3 *:hover:rounded-[5px]"
            onClick={() => setIconColorId(5)}
          >
            <NavLink
              to="password-change"
              className={({ isActive, isPending }) =>
                isActive
                  ? "bg-orange-300 block px-3 py-2 rounded-[5px] text-white"
                  : isPending
                  ? ""
                  : ""
              }
            >
              Change Password
            </NavLink>
          </li>
        </ul>
        <div
          className="text-white-500 px-3 bg-orange-200 rounded-lg text-[14px] py-2 mx-3"
          onClick={async () => {
            try {
              const logOut = await api.post("logout/", {});
              localStorage.removeItem("cartId");
              navigate("/");
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Logout
        </div>
      </div>
    </>
  );
}
