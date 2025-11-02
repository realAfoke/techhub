import {
  useOutletContext,
  useLoaderData,
  useNavigate,
  redirect,
} from "react-router-dom";
import { api } from "../utils";
import { useEffect, useState } from "react";
import CompleteProfile from "../components/CompleteProfile";
import ShippingDetail from "../components/ShippingDetail";
import PaymentMethod from "../components/PaymentMethod";
import { cities } from "../utils";

export default function CheckOut() {
  // let { carts, isAuthenticated } = useOutletContext();
  const checkoutData = useLoaderData();
  const userInfo = checkoutData[0];
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    address: userInfo.address,
  });
  const [option, setOption] = useState({
    visible: false,
    value: userInfo.state,
    city: userInfo.state,
  });
  const [cityOption, setCityOption] = useState({
    visible: false,
    value: userInfo.city || "",
    cities: cities.find(
      (s) => s.state.toLocaleLowerCase() === option?.city.toLocaleLowerCase()
    )?.city,
  });
  useEffect(() => {
    setCityOption((prev) => ({
      ...prev,
      value: "",
      visible: false,
      cities: cities.find(
        (s) => s.state.toLocaleLowerCase() === option?.city.toLocaleLowerCase()
      )?.city,
    }));
  }, [option]);
  const paymentMethods = checkoutData[1];
  const carts = checkoutData[2];
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (isAuthenticated === false) {
  //     navigate("/");
  //   }
  // }, [isAuthenticated]);
  const date = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const deliveryDate = date.getDate();
  const deliveryMonth = months[date.getMonth()];
  const deliveryFee =
    carts.quantity > 5 ? carts.totalItem * 350 : carts.totalItem * 750;

  async function proccedToPayment() {
    try {
      if (userInfo?.profileCompleteStatus < 90) {
        console.log(formData);
        const combinedData = {
          ...formData,
          state: option.value,
          city: cityOption.value,
        };
        const cleanedData = Object.fromEntries(
          Object.entries(combinedData).filter(([_, v]) => Boolean(v))
        );
        console.log(cleanedData);
        const updatedProile = await api.patch("me/", {
          ...cleanedData,
        });
        if (updatedProile.data?.profileCompleteStatus < 90) {
          // console.error(`Error:profile not complete`)
          setError("shipping detail not complete*");
          return;
        }
      }
      const paymentDetial = await api.post("payment-initialiser/", {
        amount: carts.total + deliveryFee,
        currency: "NGN",
      });
      console.log(paymentDetial.data.data.link);
      window.location.href = paymentDetial.data.data.link;
      setError(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className=" bg-[#f0eded]">
      <div className="bg-white p-5 shadow-sm fixed top-0 w-full">
        <div className="flex gap-5 items-center">
          <span>back</span>
          <span className="font-[600] text-[20px] md:text-[16px]">
            Place your order
          </span>
        </div>
        <span className="text-[10px]">
          By proceedin you automatically accepting the Terms & Conditions
        </span>
      </div>
      <div className="mt-[6rem]">
        <h3 className="p-5 py-3 font-[500] text-[gray]  md:text-[14px]">
          ORDER SUMMARY
        </h3>
        <div className="bg-white p-5 py-3 shadow-sm *:py-1">
          <div className=" flex justify-between">
            <span className=" md:text-[14px]">
              Item's total {`(${carts.totalItem})`}
            </span>
            <span className="font-[500] text-[20px]  md:text-[16px]">{`$${carts.total}`}</span>
          </div>
          <div className=" flex justify-between">
            <span className=" md:text-[14px]">Delivery fees</span>
            <span
              className="font-[500] text-[18px
            ]  md:text-[15px]"
            >
              {`$${deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-[600]">Total</span>
            <span className="font-[600] text-[23px]  md:text-[20px]">
              ${carts.total + deliveryFee}
            </span>
          </div>
        </div>
      </div>
      <div>
        {userInfo.isVerified && userInfo.profileCompleteStatus > 80 ? (
          <ShippingDetail userInfo={userInfo} />
        ) : (
          <CompleteProfile
            formData={formData}
            cityOption={cityOption}
            option={option}
            userInfo={userInfo}
            setOption={setOption}
            setCityOption={setCityOption}
            setFormData={setFormData}
            error={error}
          />
        )}
      </div>
      {/* <div>
        <PaymentMethod paymentMethod={paymentMethods} />
      </div> */}
      <div className="">
        <h3 className="p-5 py-3 font-[500] text-[gray] md:text-[14px]">
          DELIVERY DETAILS
        </h3>
        <div className="px-5 py-2 bg-white">
          <div>
            <h3 className="font-[500]  md:text-[13px]">Pick-up Station</h3>
          </div>
          <div className=" md:text-[12px]">
            Delivery between{" "}
            {deliveryDate < 9 ? (
              <b>{`0${deliveryDate}`}</b>
            ) : (
              <b>{deliveryDate}</b>
            )}
            <b>{deliveryMonth}</b> and{" "}
            {deliveryDate < 9 ? (
              <b>{`0${deliveryDate + 1}`}</b>
            ) : (
              <b>{deliveryDate + 1}</b>
            )}
            <b>{deliveryMonth}</b>
          </div>
          <div className="*:p-1 py-3">
            <h3 className="custom-border2 md:text-[14px]">Pickup Station</h3>
            <div className="custom-border">
              <h3 className="font-[400] md:text-[12px]">
                Techhub Pickup Station {userInfo.city}
              </h3>
              <span className="text-gray-500 text-[15px] md:text-[10px]">
                MAIN BUS STOP OPPOSITE ALL GIRLS SECONDARY SECONDARY SCHOOL
              </span>
            </div>
          </div>
          <div>
            <h3 className="md:text-[14px]">Shippment 1/1</h3>
            <div>
              <div className="custom-border2 p-2">
                <div>
                  <h3 className="font-[500] md:text-[14px]">Pick-up Station</h3>
                </div>
                <div className=" md:text-[12px]">
                  Delivery between{" "}
                  {deliveryDate < 9 ? (
                    <b>{`0${deliveryDate}`}</b>
                  ) : (
                    <b>{deliveryDate}</b>
                  )}
                  <b>{deliveryMonth}</b> and{" "}
                  {deliveryDate < 9 ? (
                    <b>{`0${deliveryDate + 1}`}</b>
                  ) : (
                    <b>{deliveryDate + 1}</b>
                  )}
                  <b>{deliveryMonth}</b>
                </div>
              </div>
            </div>
            <div className="custom-border flex overflow-auto mb-4">
              <CheckOutProducts items={carts.items} />
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white text-white text-center font-[500] text-[18px]">
        <button
          className="bg-[orange] w-full py-3"
          onClick={() => proccedToPayment()}
        >
          Proceed to payment
        </button>
      </div>
    </div>
  );
}

function CheckOutProducts({ items }) {
  const summaryProduct = items?.map((item) => {
    const itemImage = item.product.productImage;
    return (
      <li
        key={item.product.name}
        className=" flex py-2 px-1 items-center w-[200px] gap-2"
      >
        <div>
          <img
            src={itemImage[0].image}
            alt=""
            className="w-[150px] h-[80px] md:w-[90px] md:h-[60px]"
          />
        </div>
        <div>
          <div className="md:text-[12px]">{item.product.name}</div>
        </div>
      </li>
    );
  });
  return <div className="flex">{summaryProduct}</div>;
}
export async function checkOutLoader() {
  try {
    const endpoint = [
      api.get(`me/`),
      api.get("payment-method"),
      api.get("cart/"),
    ];
    const promises = await Promise.allSettled(endpoint);
    const succeedRequest = [];
    for (const promise of promises) {
      if (promise.status === "fulfilled") {
        succeedRequest.push(promise.value.data);
      } else {
        console.error(`Error: request failed with reason ${promise.reason}`);
      }
    }
    return succeedRequest;
  } catch (error) {
    console.log(error);
  }
}
