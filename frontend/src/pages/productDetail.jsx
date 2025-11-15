import { useLoaderData } from "react-router-dom";
import tick from "../assets/tick.svg";
import delivery from "../assets/delivery-truck.svg";
import security from "../assets/security.svg";
import retuns from "../assets/return.svg";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../utils";
import { Link } from "react-router-dom";

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

  const fullData = useLoaderData();
  const { productDetail } = fullData;
  const { similiarProduct } = fullData;

  let allSimiliarProduct = similiarProduct?.slice(0, 15);
  allSimiliarProduct = allSimiliarProduct?.map((product) => {
    return <li key={product.id}></li>;
  });
  const [quantity, setQuantity] = useState(1);

  const images = productDetail.productImage;
  const image = images[0];
  const discount = (
    ((productDetail?.price - productDetail?.currentPrice) /
      productDetail.price) *
    100
  ).toPrecision(1);

  const specs = Object.entries(productDetail.specs);
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
      <div className="px-8 text-xl py-2 font-normal md:text-[16px]">Brand</div>
      <div className="px-8 flex flex-col gap-2">
        <div className="md:text-[14px]">{productDetail?.brand?.name}</div>
        <div className="flex gap-1 md:text-[12px]">
          <b>Country:</b>
          <span>{productDetail?.brand?.country}</span>
        </div>
        <div className="flex gap-1 md:text-[12px]">
          <b>Website :</b>
          <span>{productDetail?.brand?.website}</span>
        </div>
        <p className="md:text-[12px]">{productDetail?.brand?.description}</p>
      </div>
    </div>
  );
  return (
    <>
      <div className="bg-gray-100 md:flex md:h-screen md:overflow-hidden">
        <div
          className={`flex-2 ${
            images.lenght >= 1 ? "flex" : "flex justify-center"
          } bg-white`}
        >
          <div className="flex justify-center mt-20 w-[400px] h-[400px]">
            <img src={image.image} alt="" className="rounded-[10px]" />
          </div>
        </div>
        <div className="md:overflow-scroll flex flex-col  *:m-1 *:my-0.5">
          <div className="p-8 md:pt-18 flex flex-col gap-2 bg-white rounded-xs">
            <div className="text-[20px] md:text-[16px]">
              {productDetail.name}
            </div>
            <div className="">
              {Number(productDetail.price) ===
              Number(productDetail.currentPrice) ? (
                <p className="font-bold md:text-[14px]">
                  ${productDetail.price}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 font-bold">
                    <del className="text-gray-500 order-2">
                      ${productDetail.price}
                    </del>
                    <p className="text-[25px]">${productDetail.currentPrice}</p>
                  </div>
                  <div className="flex gap-2 text-[green]">
                    <p>
                      Save ${productDetail.price - productDetail.currentPrice}
                      .00
                    </p>
                    <div>{` (${discount}% off)`}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-[green] flex md:text-[12px]">
              <img src={tick} alt="" className="w-5" />
              <span>
                In Stock {` (${productDetail.stockQuantity} available)`}
              </span>
            </div>
            <p className="border-b-[0.5px] border-gray-400 py-2 pb-5 md:text-[12px]">
              {productDetail.description}
            </p>
            <div className={`bg-white flex flex-col md:flex-row gap-3 pt-4 `}>
              <div className="flex gap-3">
                <div className="flex justify-between items-center border border-gray-400 rounded-md flex-1 md:flex-none font-bold p-2 md:py-1 md:w-24">
                  <button
                    className="outline-none border-none"
                    onClick={() =>
                      setQuantity((prev) => (prev === 1 ? prev : prev - 1))
                    }
                  >
                    -
                  </button>

                  <span>{quantity}</span>

                  <button
                    className="outline-none border-none"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="bg-orange-300 text-white rounded-md flex-2 md:flex-none px-4 md:px-8 md:text-[14px]"
                  onClick={async () => {
                    await addToCart(productDetail.id, quantity);
                  }}
                >
                  Add to Cart
                </button>
              </div>

              <div
                className={`gap-3 flex md:text-[12px] *:rounded-md *:border *:border-gray-400`}
              >
                <button className="flex-6 md:px-5 p-2">Wishlist</button>
                <button className="flex-1 md:px-5 p-2">Share</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            {/* CONTENT SECTION */}
            <div className={`bg-white`}>
              <div className="border-b border-[#ffa500]">
                <div className="px-8 text-2xl py-5 font-normal md:text-[20px]">
                  Overview
                </div>
              </div>

              <div className="text-[20px] font-medium  px-8 md:text-[16px] pt-3">
                Key Features
              </div>

              <div className="flex flex-col gap-3 px-8 py-5 md:text-[12px]">
                {features}
              </div>

              <div>{productDetail?.brand && brand}</div>
            </div>
            <div className="flex justify-between text-[12px] bg-white p-8">
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
        </div>
      </div>
      <SimiliarProductComp similiarProduct={similiarProduct} />
    </>
  );
}

export function SimiliarProductComp({ similiarProduct }) {
  const allSimiliarProduct = similiarProduct.slice(0, 14);
  const similiarProducts = allSimiliarProduct?.map((product) => {
    const productImage = product.productImage;
    return (
      <Link
        to={`/product/${product.id}`}
        key={product.name}
        className=" flex py-2 px-1 items-center w-[200px] gap-2 shadow-sm"
      >
        <div>
          <img
            src={productImage[0].image}
            alt=""
            className="w-[150px] h-20 md:w-[150px] md:h-[100px]"
          />
        </div>
        <div>
          <div className="md:text-[12px]">{product.name}</div>
        </div>
      </Link>
    );
  });
  return (
    <div className=" bg-white p-5 overflow-auto">
      <h4 className="font-semibold text-xl p-3">You may also like</h4>
      <div className="flex gap-2 p-3">{similiarProducts}</div>
    </div>
  );
}
