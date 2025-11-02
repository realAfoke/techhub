import { Link } from "react-router-dom";
import Product from "../components/Product";
import { useOutletContext } from "react-router-dom";

export default function ProductList() {
  const { productCopy, filter } = useOutletContext();
  const allProduct = productCopy?.map((product) => {
    const urlObj = new URL(product.url);
    const route = urlObj.pathname.slice(1);
    return (
      <li key={product.id} className="list-none">
        <Link to={route}>
          <Product data={product} />
        </Link>
      </li>
    );
  });
  return (
    <div className="bg-white mt-[8.5rem]">
      {filter.searchError && (
        <div className="text-white bg-red-400 py-2 mt-[2rem] font-[500]">
          {filter.searchError}
        </div>
      )}

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]  gap-[2rem] grid-rows-[repeat(auto-fit,minmax(5rem,1fr))] p-4">
        {allProduct}
      </ul>
    </div>
  );
}
