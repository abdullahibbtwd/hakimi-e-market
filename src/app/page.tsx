import React from "react";
import Banner from "../components/Banner";
import Category from "../components/Category";
import Products from "../components/Products";

const page = () => {
  return (
    <div className="">
      <div className=" ">
        <Category/>
        <Banner />
        <Products/>
      </div>
    </div>
  );
};

export default page;
