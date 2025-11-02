import { useState, useEffect, useRef } from "react";
import { api } from "../utils";
import { Link } from "react-router-dom";

export default function Item({ item, cartId, handleAppData, status }) {
  const image = item.product.productImage[0];
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
      return update.data;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <div
        className={`grid-cols-[100px_1fr] md:grid-cols-[80px_1fr] p-3 bg-white mb-1 gap-3 items-center ${
          status.includes(item.id) ? "grid" : "hidden"
        }`}
      >
        <Link to={urlObj.pathname}>
          <img src={image.image} alt="" />
        </Link>
        <div className="flex flex-col gap-3">
          <Link to={urlObj.pathname} className="">
            <div className="truncate w-[250px] md:text-[14px]">
              {item.product.name}
            </div>
            <div className="md:text-[14px]">{item.product.currentPrice}</div>
            {item.product.stockQuantity < 5 ? (
              <div className="text-red-500 md:text-[12px]">
                {item.product.stockQuantity} remaining
              </div>
            ) : (
              <div className="md:text-[12px]">In Stock </div>
            )}
          </Link>
          <div className="flex justify-between text-white">
            <div className="border-1  border-gray-200 *:p-5 *:py-1  rounded-[5px] font-bold bg-[orange] ">
              <button
                onClick={async (e) => {
                  if (itemQuantity === 1) {
                    return;
                  }
                  const sub = await updateItem(cartId, item.id, "sub");
                  handleAppData({
                    totalItem: sub.totalItem,
                    total: sub.total,
                    carts: sub,
                    action: "sub",
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
                  const add = await updateItem(cartId, item.id, "add");
                  handleAppData({
                    totalItem: add.totalItem,
                    total: add.total,
                    carts: add,
                    action: "add",
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
                const del = await updateItem(cartId, item.id, "delete");
                handleAppData({
                  action: "delete",
                  deletedQuantity: itemQuantity,
                  total: del.total,
                  carts: del,
                  itemId: item.id,
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
