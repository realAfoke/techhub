import { useState } from "react";
export default function MenuBar({
  hideSearch,
  categories,
  brands,
  filter,
  handleFilter,
  searchFunc,
  setMenu,
}) {
  const allCategory = categories.map((category) => {
    return (
      <li key={category.name} className="flex items-center gap-2 my-2">
        <input
          type="checkbox"
          id={category.slug}
          checked={filter?.filters.category.includes(category.id)}
          onChange={() => {
            handleFilter({ objKey: "category", obj: category });
          }}
        />
        <label htmlFor={category.slug}>{category.name}</label>
      </li>
    );
  });
  const allBrand = brands.map((brand) => {
    return (
      <li key={brand.name} className="flex items-center gap-2 my-2">
        <input
          type="checkbox"
          id={brand.name}
          checked={filter?.filters.brand.includes(brand.id)}
          onChange={() => {
            handleFilter({ objKey: "brand", obj: brand });
          }}
        />
        <label htmlFor={brand.name}>{brand.name}</label>
      </li>
    );
  });
  return (
    <>
      <div
        className={` ${
          !hideSearch ? "h-[115%]" : "h-full"
        } mt-[-1px] flex overflow-scroll`}
      >
        <div className="bg-[#fff] flex-2 p-4">
          <div className="flex">
            <div className="flex justify-between items-center">
              <div className="text-[20px] font-[400]">Filter</div>
            </div>
            <div className="" onClick={() => handleFilter({ reset: "reset" })}>
              Clear All Filters
            </div>
          </div>
          <div className="mt-[1rem]">
            <div className="text-[20px] font-[400]">Categories</div>
            {allCategory}
          </div>
          <div className="mt-[1rem]">
            <div className="text-[20px] font-[400]">Brands</div>
            {allBrand}
          </div>
          <div className="flex flex-col gap-3 mt-[1rem] *:my-1">
            <span className="text-[20px] font-[400]">Price Range</span>
            <input
              type="range"
              name="price-range"
              id=""
              value={filter?.filters.price}
              max={2000}
              onChange={(e) => {
                handleFilter({ range: e });
              }}
              className={`custom-range h-[2px] bg-[orange] rounded-2xl appearance-none`}
            />
            <div className="flex justify-between">
              <span>$0</span>
              {filter?.filters.price > 0 && (
                <span>${filter?.filters.price}</span>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className=" w-full rounded-[5px] outline-none border-none p-3 text-white bg-[orange]"
              onClick={() => {
                searchFunc(filter);
                setMenu(false);
              }}
            >
              Show Products
            </button>
          </div>
        </div>
        <div className="bg-[#27252599] flex-1"></div>
      </div>
    </>
  );
}
