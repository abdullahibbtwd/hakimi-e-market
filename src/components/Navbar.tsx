"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import { MdNotifications } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Button, Menu, MenuItem } from "@mui/material";
import { useSession } from "@/app/hooks/session";

const Navbar = () => {
  const [search, setSearch] = useState(false);
  const router = useRouter();
  const { getCartCount, searchTerm, setSearchTerm } = useAppContext();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const { user, isSpecificUser, logout,isSuperAdmin } = useSession();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const menuItems = [
    <MenuItem
      key="profile"
      onClick={() => {
        handleClose();
        router.push("/my-orders");
      }}
    >
      My Orders
    </MenuItem>,
    <MenuItem
      key="account"
      onClick={() => {
        handleClose();
        router.push("/account");
      }}
    >
      Account
    </MenuItem>,
    <MenuItem
      key="logout"
      onClick={() => {
        handleClose();
        logout();
      }}
    >
      Logout
    </MenuItem>,
  ];

  if (isSpecificUser || isSuperAdmin) {
    menuItems.push(
      <MenuItem
        key="admin"
        onClick={() => {
          handleClose();
          router.push("/admin");
        }}
      >
        Admin Panel
      </MenuItem>
    );
  }
  
  return (
    <div className="flex flex-col justify-center w-full bg-[#d8f5d0] py-2  gap-2">
      <div className="flex justify-between gap-5  ">
        {/* Logo */}
        <div className="px-3 w-1/2 md:w-1/3 flex items-center">
          <h2
            onClick={() => router.push("/")}
            className="my-font cursor-pointer font-semibold tracking-wider"
          >
            HAKIMI<span className="text-green-700">-e-</span>Market
          </h2>
        </div>
        {/* search icon */}
        <div className="hidden md:flex md:w-1/3">
          <div className="flex justify-between w-full items-center bg-white p-2 rounded-md">
            <input
              value={searchTerm}
              onChange={handleSearchChange}
              type="text"
              className="w-full text-gray-800 text-[14px] outline-none bg-transparent"
            />
            <FaSearch className="text-green-800 cursor-pointer" />
          </div>
        </div>
        {/* icons */}
        <div className="w-1/2 md:w-1/3">
          <div className="flex justify-end gap-4 w-full items-center h-full px-3">
            <FaSearch
              onClick={() => setSearch(!search)}
              className="flex md:hidden"
            />
            <div className="flex relative gap-4">
              <MdNotifications className="cursor-pointer text-2xl text-green-800" />
              <div className="absolute top-0 right-0 rounded-full bg-green-950 ">
                <h3 className="text-[8px] text-white px-[4px] ">1</h3>
              </div>
            </div>

            <div
              className="flex relative gap-4"
              onClick={() => router.push("/cart")}
            >
              <BsCart className="cursor-pointer text-2xl text-green-800 font-bold" />
              <div className="absolute top-0 right-0 rounded-full bg-green-950 ">
                <h3 className="text-[8px] text-white px-[4px] ">
                  {getCartCount()}
                </h3>
              </div>
            </div>
            <div className="flex gap-4 p-[7px] rounded-full bg-white">
              {user ? (
                <>
                  <Button
                    sx={{
                      backgroundColor: "darkgreen",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "darkpurple",
                      },
                      borderRadius: "50%",
                      padding: "5px",
                      minWidth: "24px",
                      height: "24px",
                      lineHeight: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    {user.name && user.name.charAt(0)}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    {menuItems}
                  </Menu>
                </>
              ) : (
                <>
                  <FaUser
                    onClick={() => router.push("/auth/login")}
                    className="cursor-pointer text-[15px] text-green-800 font-bold"
                  />{" "}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {search && (
        <div className="flex md:hidden md:w-1/3 px-4">
          <div className="flex justify-between w-full items-center bg-white p-2 rounded-md">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full text-gray-800 text-[14px] outline-none bg-transparent"
            />
            <FaSearch className="text-green-800 cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
