import React from "react";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdAddBox } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useSession } from "@/app/hooks/session";
import { PiFlagBannerLight } from "react-icons/pi";

const SideBar = () => {
  const pathname = usePathname();
  const { isSuperAdmin } = useSession();
  const menuItems = [
    { name: "Add Product", path: "/admin", icon: <MdAddBox /> },
    {
      name: "Product List",
      path: "/admin/product-list",
      icon: <AiFillProduct />,
    },
    { name: "Orders", path: "/admin/orders", icon: <FaBoxOpen />  },
  ];
  if (isSuperAdmin) {
    menuItems.push(
      { name: "Users", path: "/admin/user", icon: <FaUser /> },
      { name: "Banner Product", path: "/admin/banner-product", icon: <PiFlagBannerLight /> }
    );
  }

  return (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={`flex items-center py-3 px-4 gap-3 ${
                isActive
                  ? "border-r-4 md:border-r-[6px] bg-green-600/10 border-green-500/90"
                  : "hover:bg-gray-100/90 border-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <p className="md:block hidden text-center">{item.name}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
