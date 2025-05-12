"use client";
import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";


const AddAddress = () => {
  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("fullname", address.fullName);
    formData.append("phoneNumber", address.phoneNumber.toString());
    formData.append("pincode", address.pincode.toString());
    formData.append("area", address.area);
    formData.append("city", address.city);
    formData.append("state", address.state);

    try {
      const response = await axios.post("/api/address", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, 
      });

      if (response.status === 201) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        
        console.error("Axios error details:", error.response?.data);
      } else {
        console.error("Non-Axios error:", error);
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form onSubmit={onSubmitHandler} className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            Add Shipping{" "}
            <span className="font-semibold text-green-600">Address</span>
          </p>
          <div className="space-y-3 max-w-sm mt-10">
            <input
              className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Full name"
              onChange={(e) =>
                setAddress({ ...address, fullName: e.target.value })
              }
              value={address.fullName}
            />
            <input
              className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Phone number"
              onChange={(e) =>
                setAddress({ ...address, phoneNumber: e.target.value })
              }
              value={address.phoneNumber}
            />
            <input
              className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Pin code"
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
              value={address.pincode}
            />
            <textarea
              className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
            
              rows={4}
              placeholder="Address (Area and Street)"
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
              value={address.area}
            ></textarea>
            <div className="flex space-x-3">
              <input
                className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                type="text"
                placeholder="City/District/Town"
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                value={address.city}
              />
              <input
                className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                type="text"
                placeholder="State"
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                value={address.state}
              />
            </div>
          </div>
          {loading ? <>
          <p>Adding.....</p>
          </>:<>
            <button
            type="submit"
            className="max-w-sm w-full mt-6 bg-green-600 text-white py-3 hover:bg-green-700 uppercase"
          >
            Save address
          </button>
          </>}
        
        </form>
        <FaLocationArrow className="md:mr-16 mt-16 md:mt-0 text-9xl text-green-700" />
      </div>
    </>
  );
};

export default AddAddress;
