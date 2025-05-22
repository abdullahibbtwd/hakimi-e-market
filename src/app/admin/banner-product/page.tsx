"use client";
import Footer from "../../../components/admin/Footer";
import { useAppContext } from "../../../context/AppContext";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

interface bannerDatas {
  id: string;
  name: string;
  description: string;
  imageUrl: string | string[];
}

const BannerProduct = () => {
  const [files, setFiles] = useState<(File | undefined)[]>([undefined]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { router } = useAppContext();
  const [banner, setBanner] = useState<bannerDatas[]>([]);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get("/api/public/banner");
        if (response.status === 200) {
          setBanner(response.data.banner || response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBannerData();
  }, []);

 

  const deleteBanner = async (bannerId: string) => {
    try {
      const response = await axios.delete("/api/delete/banner", {
        data: { id: bannerId }, 
      });

      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");

     
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Server responded with:", error.response.status);
          console.error("Error data:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Request setup error:", error.message);
        }
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    files.forEach((image) => {
      if (image) {
        formData.append("images", image);
      }
    });

    try {
      const response = await axios.post("/api/banner-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Added Successfully");
        setName("");
        setDescription("");
        setFiles([]);
      } else {
        toast.error("Something Wrong");
      }
    } catch (error) {
      console.error("Error adding product:", error);
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
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(1)].map((_, index: number) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files?.[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : "/upload_area.png"
                  }
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        {loading ? (
          <>Adding.....</>
        ) : (
          <>
            <button
              type="submit"
              className="px-8 py-2.5 bg-green-600 text-white font-medium rounded"
            >
              ADD
            </button>
          </>
        )}
      </form>

      {/* Table */}
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Banner</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className=" table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                  Banner Product
                </th>

                <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {banner.map((banners, index) => (
                <tr key={index} className="border-t border-gray-500/20 ">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={
                          Array.isArray(banners.imageUrl)
                            ? banners.imageUrl[0]
                            : banners.imageUrl
                        }
                        alt="product Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full">{banners.name}</span>
                  </td>
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <span className="truncate w-full">
                      {banners.description}
                    </span>
                  </td>

                  <td className="px-4 py-3 max-sm:hidden">
                    <div className="flex gap-3 items-center">
                      <button onClick={() => deleteBanner(banners.id)}>
                        <MdDelete className="text-3xl cursor-pointer active:scale-75 transition ease-in-out duration-500 text-green-600 " />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <Footer /> */}
      <Footer />
    </div>
  );
};

export default BannerProduct;
