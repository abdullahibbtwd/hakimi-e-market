"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import Loading from "../../../components/Loading";
import { FaBoxOpen } from "react-icons/fa";
import Footer from "../../../components/admin/Footer";
import axios from "axios";
import { OrderStatus } from "../../../../node_modules/.prisma/client";
import { toast } from "react-toastify";

interface Orders {
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
      date: number;
    };
    quantity: number;
    id: string;
  }[];
  total: number;
  address: {
    id: string;
    userId: string;
    fullname: string;
    phoneNumber: string;
    pincode: number;
    area: string;
    city: string;
    state: string;
  };
  status: string;
  createdAt: number;
}

const Orders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(true);



   const handleStatusChange = async (id: string, status: OrderStatus) => {
      try {
          const response = await axios.post('/api/update-order-status', {
            id,
            status,
          });
        
          if(response.data){
             toast.success("Updated!!") 
          }else{
              toast.error("Not Updated")
          }
          
         
      
        } catch (error) {
          console.error('Update failed:', error);
        toast.error("Error")
        }
    };


  const fetchSellerOrders = async () => {
    try {
      const response = await axios.get("/api/order/admin");
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch {
      console.log("something went wrong!");
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            {orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
                >
                  <div className="flex-1 flex gap-5 max-w-80 items-center">
                    <FaBoxOpen className="text-4xl text-green-600" />
                    <p className="flex flex-col gap-3">
                      <span className="font-medium">
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
                        {order.address.fullname}
                      </span>
                      <br />
                      <span>{order.address.area}</span>
                      <br />
                      <span>{`${order.address.city}, ${order.address.state}`}</span>
                      <br />
                      <span>{order.address.phoneNumber}</span>
                    </p>
                  </div>
                  <p className="font-medium my-auto">
                    <span className="flex items-center gap-1">
                      {currency}
                      {order.total}
                    </span>
                  </p>
                  <div>
                    <p className="flex flex-col">
                      <span>Method : COD</span>
                      <span>
                        Date : {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        Payment :
                        <select
                          value={order.status}
                            onChange={(e) =>
                                handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                          className="w-auto p-1 outline-none"
                        >
                          {Object.values(OrderStatus).map((status) => (
                            <option key={status} value={status} className="p-1">
                              {status}
                            </option>
                          ))}
                        </select>
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No orders found</p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
