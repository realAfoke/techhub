export default function Product({ data }) {
  const product = data;
  return (
    <>
      <div className="flex justify-center flex-nowrap">
        <img
          src={product.productImage[0].image}
          alt=""
          className="max-h-[150px] md:max-h-[100px]"
        />
      </div>
      <div className="flex flex-col my-2 gap-1 items-center">
        <div className="text-[15px] md:text-[13px] truncate">
          {product.name}
        </div>
        <div className="md:text-[14px]">
          {Number(product.price) === Number(product.currentPrice) ? (
            <p className="text-center font-bold">${product.price}</p>
          ) : (
            <div className="flex gap-2 justify-center font-bold">
              <del className="text-gray-500">${product.price}</del>
              <p className="">${product.currentPrice}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
