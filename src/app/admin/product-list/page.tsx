"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
import Loading from "@/components/Loading";
import { LuArrowUpRight } from "react-icons/lu";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useSession } from "@/app/hooks/session";

interface Product {
  id:string;
  name: string;
  offerPrice: number;
  imageUrl: string[];
  category: string;
 
}
const ProductList = () => {
  const { router, currency } = useAppContext();
  const {isSpecificUser,isSuperAdmin} = useSession()
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

 

  const deleteProduct = async (productId:string)=>{
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await axios.delete(`/api/delete-product/${productId}`);

      if (response.status === 200) {
          toast.success('Product deleted successfully!');
            router.refresh()
      } else {
          toast.error(`Failed to delete product. Status: ${response.status}`);
      }
  } catch  {
    toast.error("somethin went wrong")
  }
  }

  useEffect(() => {
    const fetchSellerProduct = async () => {
      try {
  
        if(isSuperAdmin){
          const response = await axios.get("/api/products"); 
          setProducts(response.data.products); 
          setLoading(false);
        }else if(isSpecificUser){
          const response = await axios.get("/api/admin-product"); 
        setProducts(response.data.products); 
        setLoading(false);
        }
        
      } catch {
        console.log("An error occurred while fetching products.");
      } 
    };
    fetchSellerProduct();
  }, []);
  if (loading) {
    return <div className="text-center p-4 w-full">
        <Loading/>
    </div>;
  }
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
    
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Product</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className=" table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                    Product
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr key={index} className="border-t border-gray-500/20 ">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={product.imageUrl[0]}
                          alt="product Image"
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {product.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center">
                        {currency}
                        {product?.offerPrice}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <div className="flex gap-3 items-center">
                         <button
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="flex group cursor-pointer items-center gap-1 px-1.5 md:px-3.5 py-2 bg-green-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Visit</span>
                        <LuArrowUpRight className="transition-transform transform translate-x-[-4px] duration-500 group-hover:translate-x-0" />
                      </button>
                      <button onClick={()=>deleteProduct(product.id)}>
                        <MdDelete className="text-3xl cursor-pointer active:scale-75 transition ease-in-out duration-500 text-green-600 "/>
                      </button>
                      </div>
                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    
      <Footer />
    </div>
  );
};

export default ProductList;
