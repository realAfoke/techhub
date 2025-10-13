import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: { "Content-Type": "application/json" },
});

// export async function loader({ request }) {
//   try {
//     const url = new URL(request.url);
//     let generalEnpoint = [api.get("categories/"), api.get("brands/")];
//     if (localStorage.getItem("cartId") !== null) {
//       const cartId = localStorage.getItem("cartId");
//       generalEnpoint.push(api.get(`cart/`, { params: { cart_id: cartId } }));
//     }
//     let responses;
//     if (url.pathname === "/") {
//       generalEnpoint.unshift(api.get("products/"));
//       responses = await Promise.allSettled(generalEnpoint);
//     } else {
//       let path = url.pathname.startsWith("/")
//         ? url.pathname.slice(1)
//         : url.pathname;
//       generalEnpoint.unshift(api.get(path));
//       responses = await Promise.allSettled(generalEnpoint);
//     }
//     const allData = [];
//     for (const response of responses) {
//       if (response.status === "fulfilled") {
//         allData.push(response.value.data);
//       } else {
//         console.error(`Request failed with reason:${response.reason} `);
//       }
//     }
//     return allData;
//   } catch (e) {
//     console.error(e);
//   }
// }

// export async function appLoader({request}){
//   try{

//   }
// }
