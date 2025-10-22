import axios from "axios";
import { redirect } from "react-router-dom";

export const api = axios.create({
  baseURL: "https://localhost:8000/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;

      try {
        await axios.post("https://localhost:8000/refresh-token/", null, {
          withCredentials: true,
        });

        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        isRefreshing = false;
        window.location.href = "login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const states = [
  "Abuja",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Kastina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const cities = [
  {
    state: "Abia",
    city: [
      "Aba",
      "Umuahia",
      "Ohafia",
      "Arochukwu",
      "Isuochi",
      "Bende",
      "Umunneochi",
      "Ikwuano",
      "Isiala Ngwa",
    ],
  },
  {
    state: "Adamawa",
    city: [
      "Yola",
      "Jimeta",
      "Mubi",
      "Ganye",
      "Numan",
      "Hong",
      "Michika",
      "Shelleng",
      "Song",
      "Girei",
    ],
  },
  {
    state: "Akwa Ibom",
    city: [
      "Uyo",
      "Eket",
      "Ikot Ekpene",
      "Oron",
      "Ikot Abasi",
      "Essien Udim",
      "Ibeno",
      "Onna",
      "Esit Eket",
      "Etinan",
    ],
  },
  {
    state: "Anambra",
    city: [
      "Awka",
      "Onitsha",
      "Nnewi",
      "Aguata",
      "Ekwulobia",
      "Ihiala",
      "Otuocha",
      "Idemili",
      "Ojoto",
    ],
  },
  {
    state: "Bauchi",
    city: [
      "Bauchi",
      "Azare",
      "Dass",
      "Ningi",
      "Toro",
      "Alkaleri",
      "Jama'are",
      "Dambam",
    ],
  },
  {
    state: "Bayelsa",
    city: [
      "Yenagoa",
      "Sagbama",
      "Brass",
      "Ogbia",
      "Nembe",
      "Ekeremor",
      "Kolokuma/Opokuma",
    ],
  },
  {
    state: "Benue",
    city: [
      "Makurdi",
      "Gboko",
      "Otukpo",
      "Gbajimba",
      "Adikpo",
      "Ado",
      "Ugbokolo",
    ],
  },
  {
    state: "Borno",
    city: [
      "Maiduguri",
      "Bama",
      "Gwoza",
      "Damboa",
      "Biu",
      "Kukawa",
      "Ngala",
      "Monguno",
    ],
  },
  {
    state: "Cross River",
    city: [
      "Calabar",
      "Ikom",
      "Ogoja",
      "Odukpani",
      "Akpabuyo",
      "Yala",
      "Bekwarra",
    ],
  },
  {
    state: "Delta",
    city: [
      "Asaba",
      "Warri",
      "Sapele",
      "Ughelli",
      "Agbor",
      "Oghara",
      "Abraka",
      "Effurun",
      "Ozoro",
      "Obiaruku",
    ],
  },
  {
    state: "Ebonyi",
    city: ["Abakaliki", "Afikpo", "Onueke", "Ezza-Ohu", "Izzi", "Ishielu"],
  },
  {
    state: "Edo",
    city: [
      "Benin City",
      "Auchi",
      "Ekpoma",
      "Uromi",
      "Igarra",
      "Igueben",
      "Etsako",
    ],
  },
  {
    state: "Ekiti",
    city: [
      "Ado-Ekiti",
      "Ikere-Ekiti",
      "Ikole",
      "Iyin-Ekiti",
      "Oye-Ekiti",
      "Emure",
      "Efon-Alaaye",
    ],
  },
  {
    state: "Enugu",
    city: ["Enugu", "Nsukka", "Awgu", "Udi", "Agbani", "Oji River", "Ezeagu"],
  },
  {
    state: "Gombe",
    city: ["Gombe", "Kaltungo", "Balanga", "Dukku", "Kwami", "Billiri"],
  },
  {
    state: "Imo",
    city: [
      "Owerri",
      "Orlu",
      "Okigwe",
      "Oguta",
      "Aba (border town)",
      "Oru East",
      "Mgbidi",
    ],
  },
  {
    state: "Jigawa",
    city: ["Dutse", "Hadejia", "Kafin Hausa", "Gumel", "Ringim", "Birnin Kudu"],
  },
  {
    state: "Kaduna",
    city: [
      "Kaduna",
      "Zaria",
      "Kafanchan",
      "Saminaka",
      "Kachia",
      "Kagoro",
      "Birnin Gwari",
    ],
  },
  {
    state: "Kano",
    city: [
      "Kano",
      "Wudil",
      "Gaya",
      "Rano",
      "Bunkure",
      "Kumbotso",
      "Kano Municipal",
    ],
  },
  {
    state: "Katsina",
    city: ["Katsina", "Funtua", "Daura", "Kankara", "Musawa", "Dutsin-Ma"],
  },
  {
    state: "Kebbi",
    city: ["Birnin Kebbi", "Argungu", "Yauri", "Jega", "Zuru", "Koko/Besse"],
  },
  {
    state: "Kogi",
    city: ["Lokoja", "Idah", "Okene", "Anyigba", "Ajaokuta", "Kabba", "Bassa"],
  },
  {
    state: "Kwara",
    city: [
      "Ilorin",
      "Offa",
      "Kaiama",
      "Lafiagi",
      "Pategi",
      "Jebba",
      "Omu-Aran",
    ],
  },
  {
    state: "Lagos",
    city: [
      "Ikeja",
      "Lagos Island",
      "Lekki",
      "Badagry",
      "Ikorodu",
      "Epe",
      "Victoria Island",
      "Yaba",
      "Surulere",
      "Apapa",
    ],
  },
  {
    state: "Nasarawa",
    city: ["Lafia", "Akwanga", "Keffi", "Kokona", "Toto", "Karu"],
  },
  {
    state: "Niger",
    city: ["Minna", "Suleja", "Kontagora", "Bida", "Zungeru", "Wushishi"],
  },
  {
    state: "Ogun",
    city: [
      "Abeokuta",
      "Ifo",
      "Sagamu",
      "Abeokuta South",
      "Ijebu-Ode",
      "Ota",
      "Ilaro",
      "Odogbolu",
    ],
  },
  {
    state: "Ondo",
    city: [
      "Akure",
      "Ondo Town",
      "Owo",
      "Akure South",
      "Ikare-Akoko",
      "Ore",
      "Okitipupa",
    ],
  },
  {
    state: "Osun",
    city: [
      "Osogbo",
      "Ilesa",
      "Ife (Ile-Ife)",
      "Ila-Orangun",
      "Igbajo",
      "Ede",
      "Iwo",
    ],
  },
  {
    state: "Oyo",
    city: [
      "Ibadan",
      "Oyo",
      "Ogbomosho",
      "Iseyin",
      "Saki",
      "Eruwa",
      "Okeho",
      "Eleyele",
    ],
  },
  {
    state: "Plateau",
    city: ["Jos", "Bukuru", "Mangu", "Bokkos", "Pankshin", "Shendam"],
  },
  {
    state: "Rivers",
    city: [
      "Port Harcourt",
      "Bonny",
      "Omoku",
      "Isiokpo",
      "Bori",
      "Eleme",
      "Degema",
      "Ahoada",
    ],
  },
  {
    state: "Sokoto",
    city: [
      "Sokoto",
      "Gwadabawa",
      "Wurno",
      "Shagari",
      "Tambuwal",
      "Dange Shuni",
    ],
  },
  {
    state: "Taraba",
    city: ["Jalingo", "Wukari", "Bali", "Sardauna (Serti)", "Gashaka", "Takum"],
  },
  {
    state: "Yobe",
    city: ["Damaturu", "Gashua", "Potiskum", "Buni Yadi", "Machina", "Bade"],
  },
  {
    state: "Zamfara",
    city: [
      "Gusau",
      "Talata Mafara",
      "Kaura Namoda",
      "Anka",
      "Bungudu",
      "Shinkafi",
    ],
  },
  {
    state: "Abuja",
    city: [
      "Abuja",
      "Gwarinpa",
      "Asokoro",
      "Maitama",
      "Wuse",
      "Garki",
      "Utako",
      "Kubwa",
    ],
  },
];

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originRequest = error.config;
//     if (error.response?.status === 401 && !originRequest._retry) {
//       originRequest._retry = true;

//       const refreshToken = localStorage.getItem("refreshToken");
//       if (!refreshToken) {
//         return redirect("login");
//       }
//       try {
//         const re = await axios.post("http://127.0.0.1:8000/refresh-token/", {
//           refresh: refreshToken,
//         });
//         const newAccessToken = re.data.access;
//         localStorage.setItem("accessToken", newAccessToken);
//         originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originRequest);
//       } catch (error) {
//         return redirect("login");
//       }
//     }
//     return Promise.reject(error);
//   }
// );

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
