export default function PaymentMethod({ paymentMethod }) {
  return (
    <>
      <h3 className="p-5 py-3 font-[500] text-[gray]">PAYMENT METHOD</h3>
      <div className="px-5 py-2 bg-white">{paymentMethod[0]?.name}</div>
    </>
  );
}

// export function Method({ method }) {
//   return <div className=" ">{method.name}</div>;
// }
