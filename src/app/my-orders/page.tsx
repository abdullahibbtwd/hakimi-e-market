"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";
import { FaBox } from "react-icons/fa";
import axios from "axios";
import Button from "@mui/material/Button";
import { OrderStatus } from "@prisma/client";
import ConfirmDialogue from "@/components/ConfirmDialogue";
import { toast } from "react-toastify";

interface orders {
  id: string;
  userId: string;
  orderItems: {
    product: {
      id: string;
      userId: string;
      name: string;
      description: string;
      price: number;
      offerPrice: number;
      image: string[];
      category: string;
      createdAt: number;
    };
    quantity: number;
    id: string;
  }[];
  total: number;
  address: {
    id: string;
    userId: string;
    fullName: string;
    phoneNumber: string;
    pincode: number;
    area: string;
    city: string;
    state: string;
  };
  status: string;
  createdAt: number;
}
const MyOrders = () => {
  const { currency,router } = useAppContext();

  const [orders, setOrders] = useState<orders[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.post("/api/recieved-order", {
        id,
        status: OrderStatus.DELIVERED,
      });

      if (response.data) {
        toast.success("Recieved Thanks You For Shopping with us");
        setOpen(false)
        router.refresh()
      } else {
        toast.error("Not Updated");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/fetch-order");
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6">My Orders</h2>
          {loading ? (
            <Loading />
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                >
                  <div className="flex-1 flex gap-5 max-w-80 items-center">
                    <FaBox className="text-4xl text-green-600" />
                    <p className="flex flex-col gap-3">
                      <span className="font-medium text-base">
                        {order.orderItems
                          .map(
                            (item) => item.product.name + ` x ${item.quantity}`
                          )
                          .join(", ")}
                      </span>
                      <span>Items : {order.orderItems.length}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">
                        {order.address.fullName}
                      </span>
                      <br />
                      <span>{order.address.area}</span>
                      <br />
                      <span>{`${order.address.city}, ${order.address.state}`}</span>
                      <br />
                      <span>{order.address.phoneNumber}</span>
                    </p>
                  </div>
                  <p className="font-medium my-auto flex gap-1 items-center">
                    <span className="text-xl">{currency}</span>
                    {order.total}
                  </p>
                  <div>
                    <div className="flex flex-col">
                      <span>Method : COD</span>
                      <span>
                        Date : {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>Payment : {order.status}</span>
                      {order.status === OrderStatus.DELIVERED ?<>
                        <Button
                      disabled
                      variant="outlined"
                      color="success"
                      onClick={handleClickOpen}
                      size="small"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      Recieved
                    </Button>
                      </>:<><Button
                      
                        variant="outlined"
                        color="success"
                        onClick={handleClickOpen}
                        size="small"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        Recieved
                      </Button></>}
                      
                      {open && (
                        <ConfirmDialogue
                        order={order.id}
                          handleUpdate={handleUpdate}
                          open={open}
                          handleClose={handleClose}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
