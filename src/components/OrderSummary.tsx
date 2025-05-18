import { useSession } from "@/app/hooks/session";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast,ToastContentProps  } from "react-toastify";
import { PaystackButton } from "react-paystack";
import dynamic from "next/dynamic";
import Loading from "./Loading";

interface Address {
  id: string;
  userId: string;
  fullname: string;
  phoneNumber: string;
  pincode: number;
  area: string;
  city: string;
  state: string;
}

const OrderSummary: React.FC = () => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error(
      "Paystack public key is not defined in environment variables"
    );
  }
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    setCartItems,
    cartItems,
  } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const { user } = useSession();
  const [loading, setLoading] = useState(false);
  const total = getCartAmount() + Math.floor(getCartAmount() * 0.02);

  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get("/api/address");
      if (response) {
        setUserAddresses(response.data.address);
      } else {
        toast.error("No Address.");
      }
    } catch {
      toast.error("Some thing went wrong!");
    }
  };

  const PaystackButton = dynamic(
    () => import("react-paystack").then((mod) => mod.PaystackButton),
    { ssr: false }
  );

  const handleClosePayment = () => {
  const toastId = toast(
    ({ closeToast }: { closeToast?: () => void }) => (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p>Are you sure you want to cancel payment?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <button 
            onClick={() => {
              closeToast?.(); // Proper null check
              // Add your cancel logic here
            }}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Yes, Cancel
          </button>
          <button 
            onClick={() => closeToast?.()}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            No, Continue
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeButton: false,
    }
  );
};
  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };
  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart/get");
      setCartItems(response.data.items || {});
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handlePlaceOrder = async () => {
    const addressId = selectedAddress?.id; // Ensure `selectedAddress` is defined
    const total = getCartAmount();
    const cartItemsArray = Array.isArray(cartItems)
      ? cartItems
      : Object.entries(cartItems || {}).map(([id, quantity]) => ({
          id,
          quantity,
        }));

    const items = cartItemsArray.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    if (!addressId) {
      toast.error("Please select an address before placing the order.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty. Add items to proceed.");
      return;
    }

    try {
      const response = await axios.post("/api/order", {
        addressId,
        items,
        total,
      });

      if (response.status === 200) {
        toast.success("Order placed successfully!");
        setCartItems({});
        router.push("/order-placed");
      } else {
        toast.error(
          response.data.error || "An error occurred while placing the order."
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "An error occurred.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  useEffect(() => {
    fetchUserAddresses();
  }, []);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullname}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullname}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800 flex items-center">
              <span className="text-xl">{currency}</span>
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800 flex items-center">
              <span className="text-xl">{currency}</span>
              {Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p className="flex items-center">
              <span className="text-2xl">{currency}</span>
              {total}
            </p>
          </div>
        </div>
      </div>
      {total !== 0 && (
        <PaystackButton
          disabled={!selectedAddress}
          className={`w-full bg-green-600 text-white py-3 mt-5 hover:bg-green-700  ${
            !selectedAddress
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-700 cursor-pointer"
          } rounded-md `}
          email={user?.email || "default@example.com"}
          amount={total * 100}
          metadata={{
            name: user?.name || "Customer",
            custom_fields: [],
          }}
          publicKey={publicKey}
          text="CHECK OUT"
          onSuccess={async () => {
            try {
              await handlePlaceOrder();
              toast.success("Thank You For Shopping With Us");

              await fetchCart(); 
            } catch (error) {
              toast.error("Failed to complete order");
            }
          }}
          onClose={() => alert("Are you sure you want to close")}
        />
      )}

      {/* <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-3 mt-5 hover:bg-green-700"
      >
        Place Order
      </button> */}
    </div>
  );
};

export default OrderSummary;
