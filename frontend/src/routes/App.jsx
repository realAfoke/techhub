import Header from "../components/Header";
import { useState, useRef, useEffect } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import { api } from "../utils";

export default function App() {
  const allData = useLoaderData();
  const categories = allData[1];
  const brands = allData[2];
  const location = useLocation();
  const isOutletRendered = location.pathname !== "/";
  const initiaLoadedCart = allData.length === 4 ? allData[3] : "";
  const [filteredOrSearcProduct, setFilterereddOrSearchProduct] =
    useState(false);
  const products = filteredOrSearcProduct ? filteredOrSearcProduct : allData[0];
  const { auth } = products[products.length - 1];
  products.pop();
  const [isAuthenticated, setIsAuthenticated] = useState(auth);
  if (isAuthenticated) {
    localStorage.removeItem("cartId");
  }

  const [filter, setFilter] = useState({
    filters: {
      brand: [],
      category: [],
      price: 0,
    },
    search: "",
  });
  const filterRef = useRef(filter);

  const quantity = initiaLoadedCart?.total_item
    ? initiaLoadedCart.total_item
    : 0;
  const subTotal = initiaLoadedCart?.total ? initiaLoadedCart.total : 0;
  const activeItemIds = initiaLoadedCart?.items?.map((item) => {
    return item.id;
  });
  const [carts, setCart] = useState({
    carts: initiaLoadedCart,
    quantity: quantity,
    status: activeItemIds || [],
    subTotal: subTotal,
  });

  // update cart item quantity or delete cart item from cart function
  function handleCart(value) {
    console.log(value);
    if (value?.action === "delete") {
      console.log("deleting ....");
      setCart((prev) => {
        return {
          ...prev,
          quantity: prev.quantity - value.deletedQuantity,
          status: activeItemIds.filter((a) => a !== value.itemId),
          subTotal: value.total,
          carts: value.carts,
        };
      });
    } else {
      setCart((prev) => {
        return {
          ...prev,
          quantity: value.totalItem,
          subTotal: value.total,
          carts: value.carts,
        };
      });
    }
  }
  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  // filter and search function ,
  ///toggle filter on and off
  function handleFilter(filterData) {
    if (filterData?.reset) {
      setTimeout(async () => {
        searchFunc(filterRef.current);
      }, [300]);
      setFilter((prev) => {
        return {
          ...prev,
          filters: { brand: [], category: [], price: 0 },
          search: "",
        };
      });
    } else if (filterData?.range) {
      setFilter((prev) => ({
        ...prev,
        search: "",
        filters: {
          ...prev.filters,
          price: Number(filterData?.range?.target.value),
        },
      }));
    } else if (filterData?.searchInput) {
      setFilter((prev) => {
        return {
          ...prev,
          search: filterData.searchInput.target.value || "",
        };
      });
    } else {
      setFilter((prev) => {
        let uncheckBoxObj = {};
        uncheckBoxObj[filterData?.objKey] = prev.filters[
          filterData?.objKey
        ].filter((b) => b !== filterData?.obj.id);
        let checkboxObj = {};
        checkboxObj[filterData?.objKey] = [
          ...prev.filters[filterData?.objKey],
          filterData?.obj.id,
        ];

        return prev.filters[filterData?.objKey].includes(filterData?.obj.id)
          ? {
              ...prev,
              filters: { ...prev.filters, ...uncheckBoxObj },
              search: "",
            }
          : {
              ...prev,
              filters: { ...prev.filters, ...checkboxObj },
              search: "",
            };
      });
    }
  }
  async function searchFunc(filter) {
    try {
      if (
        filter?.filters?.category ||
        filter?.filters?.brand ||
        filter?.filters?.price
      ) {
        const realObj = {};
        let allData = Object.entries(filter.filters);
        for (const data of allData) {
          if (isNaN(data[1])) {
            realObj[data[0]] = data[1].join(",");
          } else {
            realObj[data[0]] = data[1].length === 1 ? data[1][0] : data[1];
          }
        }
        const search = await api.get("search/", {
          params: { ...realObj },
        });
        setFilterereddOrSearchProduct(search.data);
      } else if (filter.search) {
        const search = await api.get("search/", {
          params: { ...{ name: filter.search } },
        });
        setFilterereddOrSearchProduct(search.data);
      } else {
        const fetchAllProduct = await api.get("products/");
        setFilterereddOrSearchProduct(fetchAllProduct.data);
      }
    } catch (error) {
      console.error(`Error:${error}`);
    }
  }
  async function addToCart(params, quantity) {
    const cartId =
      localStorage.getItem("cartId") === null
        ? null
        : localStorage.getItem("cartId");
    try {
      const cart = await api.post(`cart/`, {
        cart_id: cartId,
        carts: [
          {
            product: params,
            quantity: quantity,
          },
        ],
      });
      if (isAuthenticated) {
        localStorage.removeItem("cartId");
      } else {
        localStorage.setItem("cartId", cart.data.cart_id);
      }
      setCart((prev) => ({
        ...prev,
        quantity: cart.data.total_item,
        carts: cart.data,
      }));
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <>
      <div className="bg-[#eeeded]">
        <Header
          isAuthenticated={isAuthenticated}
          categories={categories}
          brands={brands}
          carts={carts}
          filter={filter}
          handleFilter={handleFilter}
          searchFunc={searchFunc}
          hideSearch={isOutletRendered}
          handleAuthentication={setIsAuthenticated}
        />
        <Outlet
          context={{ products, addToCart, carts, handleCart, isAuthenticated }}
        />
      </div>
    </>
  );
}

export async function appLoader() {
  try {
    const endpoints = [
      api.get("products/"),
      api.get("categories"),
      api.get("brands"),
      api.get("cart/", {
        params: { cart_id: localStorage.getItem("cartId") },
      }),
    ];
    const promises = await Promise.allSettled(endpoints);
    const successfull = [];
    for (const promise of promises) {
      if (promise.status === "fulfilled") {
        successfull.push(promise.value.data);
        if (promise.value.data?.cart_id) {
          localStorage.setItem("cartId", promise.value.data.cart_id);
        }
      } else {
        console.error(`Error:Request failed with reason ${promise.reason}`);
      }
    }
    return successfull;
  } catch (error) {
    console.error(error);
  }
}
