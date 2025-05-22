import React from "react";
import { useAppContext } from "../context/AppContext";

const Footer = () => {
  const { router } = useAppContext();
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start bg-[#d8f5d0] mt-5 justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <div className="px-3 w-full md:w-full flex items-center">
            <h2
              onClick={() => router.push("/")}
              className="my-font cursor-pointer text-center font-semibold tracking-wider"
            >
              HAKIMI<span className="text-green-700">-e-</span>Market
            </h2>
          </div>
          <p className="mt-6 text-sm hidden md:flex">
            Hakimi E-Commerce is a new platform revolutionizing online shopping
            in Nigeria. It offers a wide range of products, from electronics to
            groceries, focusing on affordability, reliability, and fast
            delivery. With secure payments, user-friendly navigation, and
            excellent customer support, Hakimi ensures a seamless shopping
            experience. It caters to both seasoned and first-time shoppers. Shop
            smarter, live better with Hakimi E-Commerce!
          </p>
        </div>

        <div className="w-1/2 items-center justify-start md:justify-center hidden mf:flex">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">
                  Home
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">
                  About us
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">
                  Contact us
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>08165658315</p>
              <p>hakimi.e.market@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Elvershdev All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
