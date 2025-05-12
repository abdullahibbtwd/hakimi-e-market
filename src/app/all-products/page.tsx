"use client"
import Category from '@/components/Category';
import ProductCard from '@/components/ProductsCard';
import { useAppContext } from '@/context/AppContext';
import React from 'react'

const AllProduct = () => {

  const { filteredProducts } = useAppContext();

  return (
    <div>
      <Category/>
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-green-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {filteredProducts.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
            </div>
    </div>
  )
}

export default AllProduct