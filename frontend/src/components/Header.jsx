import hambuger from "../assets/menu.svg";
import trolley from "../assets/cart.svg";
import userIcon from "../assets/user.svg";
import { Link } from "react-router-dom";
import MenuBar from "./MenuBar";
import { useEffect, useRef, useState } from "react";
import { api } from "../utils";

export default function Header({
  isAuthenticated,
  categories,
  brands,
  carts,
  filter,
  handleFilter,
  searchFunc,
  hideSearch,
  handleAuthentication,
}) {
  console.log(carts);
  const [menu, setMenu] = useState(false);
  let debouncer = useRef(null);
  const searchRef = useRef(filter?.search);

  useEffect(() => {
    searchRef.current = filter?.search;
  }, [filter?.search]);
  return (
    <>
      <header
        className={`fixed z-[9999] w-full top-0  flex flex-col  ${
          menu ? "h-full" : ""
        }`}
      >
        <div
          className={`bg-[orange] py-4 flex flex-col ${
            !hideSearch ? "gap-5" : "gap-2"
          }`}
        >
          <div className="flex justify-between px-5">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <img
                src={hambuger}
                alt=""
                className="h-8"
                onClick={() => setMenu(!menu)}
              />
              <Link
                to="/"
                className="uppercase font-bold tracking-wide text-2xl "
              >
                techhub
              </Link>
            </div>
            <div className="flex items-center flex-wrap gap-5">
              <Link to={isAuthenticated ? "user" : "create-account"}>
                <img src={userIcon} alt="" className="h-8" />
              </Link>
              <span
                onClick={() => {
                  localStorage.removeItem("refreshToken"),
                    localStorage.removeItem("acccessToken"),
                    localStorage.removeItem("cartId");
                  handleAuthentication(false);
                }}
              >
                Logout
              </span>
              <Link to="/cart/" replace className="relative">
                <img src={trolley} alt="" className="h-8" />
                <span
                  className={` ${
                    carts?.quantity > 0 ? "block" : "hidden"
                  } text-[orange] bg-white w-[25px] h-[25px]  absolute top-0 mt-[-10px] ml-4 rounded-full text-[13px] text-center p-0.5 
        `}
                >
                  {carts?.quantity}
                </span>
              </Link>
            </div>
          </div>
          <div className="px-3">
            {!hideSearch && (
              <input
                type="search"
                name="productSearch"
                id="search"
                value={filter.search}
                onChange={(e) => {
                  clearTimeout(debouncer.current);
                  handleFilter({ searchInput: e });
                  debouncer.current = setTimeout(() => {
                    searchFunc({ search: searchRef.current });
                  }, 500);
                }}
                placeholder="Search products,brands and categories"
                className="outline-none px-4 py-3 rounded-[30px] w-full bg-white"
              />
            )}
          </div>
        </div>
        <div className="overflow-scroll">
          {menu && (
            <MenuBar
              hideSearch={hideSearch}
              categories={categories}
              brands={brands}
              filter={filter}
              handleFilter={handleFilter}
              searchFunc={searchFunc}
              setMenu={setMenu}
            />
          )}
        </div>
      </header>
    </>
  );
}
