import axios from "axios";
import { redirect } from "react-router-dom";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originRequest = error.config;
    if (error.response?.status === 401 && !originRequest._retry) {
      originRequest._retry = true;
      console.log(originRequest);

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return redirect("login");
      }
      try {
        const re = await axios.post("http://127.0.0.1:8000/refresh-token/", {
          refresh: refreshToken,
        });
        const newAccessToken = re.data.access;
        localStorage.setItem("accessToken", newAccessToken);
        originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originRequest);
      } catch (error) {
        return redirect("login");
      }
    }
    return Promise.reject(error);
  }
);

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
