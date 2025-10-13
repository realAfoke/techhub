import { useState, useEffect, useRef } from "react";
import { api } from "../utils";
import { Link } from "react-router-dom";

export default function Item({ item, handleCart, status }) {
  const image = item.product.product_image[0];
  const urlObj = new URL(item.product.url);
  const [itemQuantity, setItemQuantity] = useState(item.quantity);

  async function updateItem(cartId, itemId, action) {
    let update;
    try {
      if ((action === "add") | (action === "sub")) {
        update = await api.patch(`cart/item/${cartId}/`, {
          item_id: itemId,
          type: action,
        });
      } else {
        update = await api.delete(`cart/item/${cartId}/`, {
          params: {
            item_id: itemId,
            type: action,
          },
        });
      }
      // console.log(update.data);
      return update.data;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <div
        className={`grid-cols-[100px_1fr] p-3 bg-white mb-3 gap-3 items-center ${
          status === "deleted" ? "hidden" : "grid"
        }`}
      >
        <Link to={urlObj.pathname}>
          <div className="">
            <img src={image.image} alt="" />
          </div>
        </Link>
        <div className="flex flex-col gap-3">
          <Link to={urlObj.pathname} className="">
            <div className="truncate w-[250px]">{item.product.name}</div>
            <div>{item.product.current_price}</div>
            {item.product.stock_quantity < 5 ? (
              <div className="text-red-500">
                {item.product.stock_quantity} remaining
              </div>
            ) : (
              <div>In Stock </div>
            )}
          </Link>
          <div className="flex justify-between text-white">
            <div className="border-1  border-gray-200 *:p-5 *:py-3  rounded-[5px] font-bold bg-[orange] ">
              <button
                onClick={async (e) => {
                  if (itemQuantity === 1) {
                    return;
                  }
                  const sub = await updateItem(item.cart, item.id, "sub");
                  handleCart({
                    totalItem: sub.total_item,
                    total: sub.total,
                    carts: sub,
                  });
                  setItemQuantity((prev) => (prev === 1 ? prev : prev - 1));
                }}
              >
                -
              </button>
              <span className="border-l-1 border-r-1 border-gray-200">
                {itemQuantity}
              </span>
              <button
                value={item.id}
                onClick={async (e) => {
                  const add = await updateItem(item.cart, item.id, "add");
                  handleCart({
                    totalItem: add.total_item,
                    total: add.total,
                    carts: add,
                  });
                  setItemQuantity((prev) => prev + 1);
                }}
              >
                +
              </button>
            </div>
            <button
              className="text-[orange] px-4"
              onClick={async (e) => {
                const del = await updateItem(item.cart, item.id, "delete");
                handleCart({
                  action: "delete",
                  deletedQuantity: itemQuantity,
                  total: del.total,
                  carts: del,
                });
              }}
            >
              del
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
