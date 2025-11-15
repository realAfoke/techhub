export default function Footer() {
  return (
    <>
      <footer className="text-[14px] md:text-[12px] text-gray-300 bg-[#1a1a1a] pt-15 pb-2 px-5 antialiased">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] border-b border-gray-100/30 pb-5">
          <div>
            <h4 className="text-xl font-semibold text-white md:text-[16px] ">
              Techhub
            </h4>
            <span className="text-[12px] md:text-[10px]">
              Your trusted source for premium electronics in Nigeria
            </span>
          </div>
          <div>
            <h4 className="text-white text-xl font-semibold py-4 md:text-[16px]">
              Customer Service
            </h4>
            <ul className="flex gap-3 flex-col">
              <li>Contact Us</li>
              <li>Track you order</li>
              <li>Shipping & Delivery</li>
              <li>Returns & Refund</li>
              <li>FAQs</li>
              <li>Payment Methods</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white py-4 md:text-[16px]">
              Quick Links
            </h4>
            <ul className="flex gap-3 flex-col">
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Careers</li>
              <li>Blog/News</li>
              <li>Sitemap</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white py-4 md:text-[16px]">
              Stay Updated
            </h4>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter you email address"
                className="bg-gray-50/5 p-5 py-4 md:py-2 md:px-2 md:text-[10px] rounded-md outline-none border-none "
              />
              <button className="p-5 py-3 font-semibold bg-orange-300 md:py-2 md:px-2 md:text-[10px] text-white text-center rounded-md outline-none border-none">
                Subscribe Now
              </button>
            </div>
            <div className="flex justify-between py-5 text-white *:p-3 :py-2 gap-3 *:rounded-md *:bg-gray-100/5 md:text-[8px] md:*:py-2">
              <span>VISA</span>
              <span>MASTERCARD</span>
              <span>VERVE</span>
              <span>FLUTTERWAVE</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between items-center justify-center gap-3  text-[10px] py-5">
          <span className="text-gray-500 ">
            &copy; 2024 Techhub All rights reserved
          </span>
          <div className="flex md:flex-row flex-col gap-2">
            <span className="bg-gray-100/5 text-white p-2 px-5 rounded-md">
              Made in Nigeria
            </span>
            <span className="bg-gray-100/5 text-white p-2 px-5 rounded-md">
              Secure Payment
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
