import Header from "../components/Header";
import { useState, useRef, useEffect } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import { api } from "../utils";
import Footer from "../components/Footer";

export default function App() {
  const allData = useLoaderData();
  const categories = allData[1];
  const brands = allData[2];
  const location = useLocation();
  const isOutletRendered = location.pathname !== "/";
  // console.log("all data:", allData);
  const initiaLoadedCart = allData.length === 4 ? allData[3] : "";
  // console.log("initial cart load:", initiaLoadedCart);
  const [filteredOrSearcProduct, setFilterereddOrSearchProduct] =
    useState(false);
  const productsData = filteredOrSearcProduct
    ? filteredOrSearcProduct
    : allData[0];

  const productCopy = productsData.slice();

  let authStatus = false;
  if (Object.keys(productCopy[productCopy.length - 1]).includes("auth")) {
    authStatus = productCopy.pop();
  }

  const { auth } = authStatus;
  const [filter, setFilter] = useState({
    filters: {
      brand: [],
      category: [],
      price: 0,
    },
    search: "",
    searchError: false,
  });

  useEffect(() => {
    if (filter.search) setFilter((prev) => ({ ...prev, searchError: false }));
  }, [filter.search]);
  const filterRef = useRef(filter);

  const quantity = initiaLoadedCart?.totalItem ? initiaLoadedCart.totalItem : 0;
  const subTotal = initiaLoadedCart?.total ? initiaLoadedCart.total : 0;
  const activeItemIds = initiaLoadedCart?.items?.map((item) => {
    return item.id;
  });
  const [appData, setAppData] = useState({
    carts: initiaLoadedCart,
    quantity: quantity,
    status: activeItemIds || [],
    subTotal: subTotal,
    isAuthenticated: auth,
  });

  function handleAppData(value) {
    switch (value.action) {
      case "delete":
        setAppData((prev) => {
          return {
            ...prev,
            quantity: prev.quantity - value.deletedQuantity,
            status: activeItemIds.filter((a) => a !== value.itemId),
            subTotal: value.total,
            carts: value.carts,
          };
        });
        break;
      case "sub":
        setAppData((prev) => {
          return {
            ...prev,
            quantity: value.totalItem,
            subTotal: value.total,
            carts: value.carts,
          };
        });
        break;
      case "add":
        setAppData((prev) => {
          return {
            ...prev,
            quantity: value.totalItem,
            subTotal: value.total,
            carts: value.carts,
          };
        });
        break;
      default:
        setAppData({
          carts: 0,
          quantity: "",
          status: [],
          subTotal: "",
          isAuthenticated: false,
        });
        break;
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
      setFilter((prev) => ({
        ...prev,
        searchError: error.response.data.response,
      }));
      // console.log(error);
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
      if (appData.isAuthenticated) {
        localStorage.removeItem("cartId");
      } else {
        localStorage.setItem("cartId", cart.data.cartId);
      }
      setAppData((prev) => ({
        ...prev,
        quantity: cart.data.totalItem,
        carts: cart.data,
        subTotal: cart.data.total,
        status: [...new Set(cart.data.items.map((item) => item.id))],
      }));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <div className="bg-[#eeeded] antialiased">
        <Header
          categories={categories}
          brands={brands}
          appData={appData}
          handleAppData={handleAppData}
          filter={filter}
          handleFilter={handleFilter}
          searchFunc={searchFunc}
          hideSearch={isOutletRendered}
        />
        <Outlet
          context={{
            productCopy,
            addToCart,
            appData,
            handleAppData,
            filter,
          }}
        />
        <Footer />
      </div>
    </>
  );
}

export async function appLoader() {
  try {
    let cart;
    if (localStorage.getItem("cartId")) {
      cart = api.get("cart/", {
        params: { cart_id: localStorage.getItem("cartId") },
      });
    } else {
      cart = api.get("cart/");
    }
    const endpoints = [
      api.get("products/"),
      api.get("categories"),
      api.get("brands"),
      cart,
    ];
    const promises = await Promise.allSettled(endpoints);
    const successfull = [];
    for (const promise of promises) {
      if (promise.status === "fulfilled") {
        successfull.push(promise.value.data);
        if (
          !Object.keys(promise.value.data).includes("ownerType") &&
          promise.value.data?.cartId
        ) {
          localStorage.setItem("cartId", promise.value.data.cartId);
        } else {
          localStorage.removeItem("cartId");
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
