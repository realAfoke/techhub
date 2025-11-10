import { api } from "../utils";
import hamburger from "../assets/menu.svg";
import { useLoaderData, Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  const [hideMenu, setHideMenu] = useState(true);
  const profileInfo = useLoaderData();
  const navigate = useNavigate();
  const firstName = profileInfo.firstName;
  const initails = firstName.slice(0, 1);

  return (
    <div className="bg-gray-50 h-screen text-gray-800 antialiased overflow-auto">
      <header className="flex justify-between fixed top-0 w-full p-4 px-6 items-center bg-orange-300 shadow md:hidden">
        <div className="flex gap-5">
          <div>
            <img
              src={hamburger}
              alt=""
              className="w-8"
              onClick={(e) => setHideMenu(true)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="uppercase bg-white text-orange-300 rounded-full font-bold text-lg h-10 w-10 justify-center">
              <span className="p-2 block ml-1.5 -mt-0.5">{initails}</span>
            </div>
            <div className="*:text-white">
              <div>Hi,</div>
              <div className="font-medium">{profileInfo.lastName}</div>
            </div>
          </div>
        </div>
        <div className="text-white">
          <Link to="/">continue shopping</Link>
        </div>
      </header>
      {hideMenu && (
        <div className="z-99999 flex bg-black/40 absolute w-full h-screen top-0">
          <div className="bg-white flex-2 overflow-hidden p-3 flex flex-col gap-3 py-4">
            <div className="flex items-center gap-3 py-2">
              <div className="uppercase bg-orange-100 text-orange-500 rounded-full font-bold text-lg h-12 w-12 justify-center">
                <span className="p-2 block ml-2.5 mt-0.5">{initails}</span>
              </div>
              <div>
                <div>Hi,</div>
                <div className="font-medium">{profileInfo.lastName}</div>
              </div>
            </div>
            <ul
              className="list-none flex flex-col gap-3 px-3 *:p-1"
              onClick={(e) => setHideMenu(false)}
            >
              <li>
                <Link to=".">Dashboard</Link>
              </li>
              <li>
                <Link to="order">Order History</Link>
              </li>
              <li>
                <Link to="account-detail">Account Details </Link>{" "}
              </li>
              <li>
                <Link to="address">Saved Address </Link>
              </li>
              <li>
                <Link to="password-change">Change Password</Link>
              </li>
              <li
                className="text-red-500"
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
              </li>
            </ul>
          </div>

          <div className="flex-1" onClick={(e) => setHideMenu(false)}></div>
        </div>
      )}
      <div className="mt-20">
        <Outlet context={{ profileInfo }} />
      </div>
    </div>
  );
}

export async function profileLoader() {
  try {
    const profileInfo = await api.get("me/");
    return profileInfo.data;
  } catch (error) {
    console.error(error);
  }
}
