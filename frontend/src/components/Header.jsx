import hambuger from "../assets/menu.svg";
import trolley from "../assets/cart.svg";
import userIcon from "../assets/user.svg";
import { Link, redirect, useNavigate } from "react-router-dom";
import MenuBar from "./MenuBar";
import { useEffect, useRef, useState } from "react";
import { api } from "../utils";

export default function Header({
  categories,
  brands,
  appData,
  filter,
  handleFilter,
  searchFunc,
  hideSearch,
}) {
  const [menu, setMenu] = useState(false);
  let debouncer = useRef(null);
  const searchRef = useRef(filter?.search);

  useEffect(() => {
    searchRef.current = filter?.search;
  }, [filter?.search]);

  return (
    <div className="antialiased">
      <header
        className={`fixed z-9999 w-full top-0  flex flex-col  ${
          menu ? "h-full" : ""
        }`}
      >
        <div
          className={`bg-orange-300 py-4 flex flex-col ${
            !hideSearch ? "gap-5" : "gap-2"
          }`}
        >
          <div className="flex justify-between px-5">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <img
                src={hambuger}
                alt=""
                className="h-8 md:h-6"
                onClick={() => setMenu(!menu)}
              />
              <Link
                to="/"
                className="uppercase font-bold tracking-wide text-2xl md:text-lg"
              >
                techhub
              </Link>
            </div>
            <div className="flex items-center flex-wrap gap-5">
              <button
                onClick={async () => {
                  try {
                    const auth = await api.get("me/");
                    window.location.href = "/profile";
                  } catch (error) {
                    console.error(error);
                    window.location.href = "/create-account";
                  }
                }}
              >
                <img src={userIcon} alt="" className="h-8 md:h-6" />
              </button>

              <Link to="/cart/" replace className="relative">
                <img src={trolley} alt="" className="h-8 md:h-6" />
                <span
                  className={` ${
                    appData?.quantity > 0 ? "block" : "hidden"
                  } text-[orange] bg-white w-[25px] h-[25px]  absolute top-0 ml-4 -mt-2.5 rounded-full text-[13px] md:text-[10px] md:max-w-5 md:max-h-5 text-center p-0.5 
        `}
                >
                  {appData?.quantity}
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
                className="outline-none px-4 py-3 rounded-[30px] w-full bg-white md:py-2 md:text-[12px]"
              />
            )}
          </div>
        </div>
        <div className={``}>
          {menu && (
            <MenuBar
              hideSearch={hideSearch}
              categories={categories}
              brands={brands}
              filter={filter}
              handleFilter={handleFilter}
              searchFunc={searchFunc}
              menu={menu}
              setMenu={setMenu}
            />
          )}
        </div>
      </header>
    </div>
  );
}
