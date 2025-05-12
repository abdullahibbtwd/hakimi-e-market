"use client";
import React from "react";
import SideBar from "@/components/admin/Sidebar";
const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      
      <div className="flex w-full">
        <SideBar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
