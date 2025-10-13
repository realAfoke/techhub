export default function Product({ data }) {
  const product = data;
  return (
    <>
      <div className="flex justify-center flex-nowrap">
        <img
          src={product.product_image[0].image}
          alt=""
          className="max-h-[150px]"
        />
      </div>
      <div className="flex flex-col my-2 gap-1">
        <div className="text-[15px] truncate">{product.name}</div>
        <div className="">
          {Number(product.price) === Number(product.current_price) ? (
            <p className="text-center font-bold">${product.price}</p>
          ) : (
            <div className="flex gap-2 justify-center font-bold">
              <del className="text-gray-500">${product.price}</del>
              <p className="">${product.current_price}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
