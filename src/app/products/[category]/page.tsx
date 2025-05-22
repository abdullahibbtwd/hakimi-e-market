"use client";
import { useAppContext } from "../../../context/AppContext";
import { useParams } from "next/navigation";
import React from "react";
import ProductCard from "../../../components/ProductsCard";
import { DataCategories } from "../../../Data";

// interface Product {
//   _id: string;
//   userId: string;
//   name: string;
//   description: string;
//   price: number;
//   offerPrice: number;
//   image: string[];
//   category: string;
//   date: number;
//   __v: number;
// }

const Category = () => {
  const params = useParams(); // Call useParams without arguments
  const { category } = params;

  const { products } = useAppContext();


  const filteredProducts = products?.filter(
    (prod) => prod.category?.toLowerCase() === category
  );

 
  return (
    <div>
      <div className="flex flex-col items-center pt-14">
        <div className="text-2xl font-medium text-left w-full">
          {category &&
            DataCategories.map((dat) => (
              <div key={dat.slug}>
                {category === dat.slug ? (
                  <h1 className="capitalize text-center underline-after text-green-950 ">
                    {dat.title}
                  </h1>
                ) : (
                  <></>
                )}
              </div>
            ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
          {filteredProducts?.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
