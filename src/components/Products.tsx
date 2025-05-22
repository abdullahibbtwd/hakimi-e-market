"use client";
import React from "react";
import ProductCard from "./ProductsCard";
import { useAppContext } from "../context/AppContext";
import Loading from "./Loading";

const Products = () => {
  const { router, filteredProducts,loading} = useAppContext();

  if(loading){
    return(
      <div><Loading/></div>
    )
  }
  return (
    <div>
      <div className="flex flex-col items-center pt-14">
        <p className="text-2xl font-medium text-left w-full">
          Popular products
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
         
              {filteredProducts.map((product, index: number) => (
                <ProductCard key={index} product={product} />
              ))}
          
        </div>
        <button
          onClick={() => {
            router.push("/all-products");
          }}
          className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-green-600 hover:text-white cursor-pointer transition"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default Products;
