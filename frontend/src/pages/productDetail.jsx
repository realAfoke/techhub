import { useLoaderData } from "react-router-dom";
import tick from "../assets/tick.svg";
import delivery from "../assets/delivery-truck.svg";
import security from "../assets/security.svg";
import retuns from "../assets/return.svg";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../utils";

export async function productDetailLoader({ request }) {
  try {
    const url = new URL(request.url);
    const endpoint = url.pathname.startsWith("/")
      ? url.pathname.slice(1)
      : url.pathname;
    const detail = await api.get(`${endpoint}`);
    return detail.data;
  } catch (error) {
    console.error(error);
  }
}

export default function ProductDetail() {
  const { addToCart } = useOutletContext();

  const fullDetail = useLoaderData();
  const [quantity, setQuantity] = useState(1);

  const images = fullDetail.productImage;
  const image = images[0];
  const discount = (
    ((fullDetail?.price - fullDetail?.currentPrice) / fullDetail.price) *
    100
  ).toPrecision(1);

  const specs = Object.entries(fullDetail.specs);
  const features = specs.map((feat, index) => {
    return (
      <li key={index} className="list-none flex gap-5">
        <img src={tick} alt="" className="w-5" />
        <span>{`${feat[0]} : ${feat[1]}`}</span>
      </li>
    );
  });
  let brand = (
    <div className="my-5">
      <div className="px-8 text-xl py-2 font-[400]">Brand</div>
      <div className="px-8 flex flex-col gap-2">
        <div>{fullDetail?.brand?.name}</div>
        <div className="flex gap-1">
          <b>Country:</b>
          <span>{fullDetail?.brand?.country}</span>
        </div>
        <div className="flex gap-1">
          <b>Website :</b>
          <span>{fullDetail?.brand?.website}</span>
        </div>
        <p>{fullDetail?.brand?.description}</p>
      </div>
    </div>
  );
  return (
    <>
      <div className="bg-gray-100 ">
        <div
          className={`${
            images.lenght >= 1 ? "flex" : "flex justify-center"
          } bg-white`}
        >
          <div className="flex justify-center mt-20 w-[400px]">
            <img src={image.image} alt="" className="rounded-[10px]" />
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          <div className="m-2 md:mx-1 p-8 flex flex-col gap-4 bg-white rounded-[2px]">
            <div className="text-[20px]">{fullDetail.name}</div>
            <div className="">
              {Number(fullDetail.price) === Number(fullDetail.currentPrice) ? (
                <p className="font-bold">${fullDetail.price}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 font-bold">
                    <del className="text-gray-500 order-2 mt-1">
                      ${fullDetail.price}
                    </del>
                    <p className="text-[25px]">${fullDetail.currentPrice}</p>
                  </div>
                  <div className="flex gap-2 text-[green]">
                    <p>Save ${fullDetail.price - fullDetail.currentPrice}.00</p>
                    <div>{` (${discount}% off)`}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-[green] flex gap-2 mt-5">
              <img src={tick} alt="" className="w-5" />
              <span>In Stock {` (${fullDetail.stockQuantity} available)`}</span>
            </div>
            <p className="border-b-[0.5px] border-gray-400 py-5 pb-5">
              {fullDetail.description}
            </p>
            <div className="flex justify-between text-[12px] mt-5">
              <div className="flex flex-col gap-2 items-center">
                <img src={delivery} alt="" className="w-8" />
                <b>Free shipping </b>
                <span>Orders over $50</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <img src={retuns} alt="" className="w-8" />
                <b>30-Days Returns</b>
                <span>Early returns</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <img src={security} alt="" className="w-8" />
                <b>2-Year Warranty</b>
                <span>Full coverage</span>
              </div>
            </div>
          </div>
          <div className="my-2 mt-[0.5rem] md:mt-0 flex flex-col">
            <div className="bg-white sticky top-[80%] md:top-[0%] translate-y-[50%] md:translate-y-[5%] flex flex-col gap-1 md:pt-[0rem] md:top-[86%] mx-2 md:mx-0 md:px-2 *:px-3">
              <div className="flex gap-3">
                <div className="flex justify-between items-center border-1 border-gray-400 rounded-xl flex-1 font-bold">
                  <button
                    className="p-4  outline-none border-none"
                    onClick={() => {
                      setQuantity((prev) => (prev === 1 ? prev : prev - 1));
                    }}
                  >
                    -
                  </button>
                  <span className="p-4">{quantity}</span>
                  <button
                    className="p-4 outline-none border-none"
                    onClick={() => {
                      setQuantity((prev) => prev + 1);
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  className="p-4 bg-[orange] text-white rounded-xl flex-2"
                  onClick={async () => {
                    console.log(fullDetail.id, fullDetail);
                    const add = await addToCart(fullDetail.id, quantity);
                  }}
                >
                  Add to Cart
                </button>
              </div>
              <div className="flex gap-3">
                <button className="p-4 rounded-xl border-1 border-gray-400 flex-6">
                  Wishlist
                </button>
                <button className="p-4  rounded-xl border-1 border-gray-400 flex-1">
                  share
                </button>
              </div>
            </div>
            <div className="bg-white mx-2 md:mt-[-7rem] md:mx-0 py-5 mt-[-8.3rem]">
              <div className="border-b-1 border-[#ffa500]">
                <div className="px-8 text-2xl py-5 font-[400]">Overview</div>
              </div>
              <div className="text-[20px] font-[500] my-5 px-8">
                Key Features
              </div>
              <div className="flex flex-col gap-3 px-8">{features}</div>
              <div>{fullDetail?.brand && brand}</div>
            </div>
            <div className="h-[100px] md:h-[70px]"></div>
          </div>
        </div>
      </div>
    </>
  );
}
