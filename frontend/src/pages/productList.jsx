import { Link, Outlet, useLoaderData } from "react-router-dom";
import Header from "../components/Header";
import Product from "../components/Product";
import { useEffect, useRef, useState } from "react";
import { api } from "../utils";
import { useOutletContext } from "react-router-dom";

export default function ProductList() {
  const { products } = useOutletContext();
  const allProduct = products.map((product) => {
    const urlObj = new URL(product.url);
    return (
      <li key={product.id} className="list-none">
        <Link to={urlObj.pathname}>
          <Product data={product} />
        </Link>
      </li>
    );
  });
  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] mt-[8rem] gap-[2rem] grid-rows-[repeat(auto-fit,minmax(5rem,1fr))] p-4">
        {allProduct}
      </ul>
    </>
  );
}
