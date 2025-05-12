"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import axios from "axios";
import { useSession } from "@/app/hooks/session";
import { toast } from "react-toastify";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  imageUrl: string[];
  category: string;
  date: number;
  Stock: number;
}
interface CartItems {
  [itemId: string]: number;
}
interface AppContextType {
  currency: JSX.Element | null;
  router: AppRouterInstance;
  products: Product[];
  fetchProductData: () => Promise<void>;
  cartItems: { [itemId: string]: number };
  setCartItems: React.Dispatch<
    React.SetStateAction<{ [itemId: string]: number }>
  >;
  addToCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  getCartCount: () => number;
  getCartAmount: () => number;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredProducts: Product[];
  updateStock: (itemId: string, newStock: number) => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const defaultAppContext: AppContextType = {
  currency: null,
  router: {} as AppRouterInstance,
  products: [],
  fetchProductData: async () => {},
  cartItems: {},
  setCartItems: () => {},
  addToCart: async () => {},
  updateCartQuantity: async () => {},
  getCartCount: () => 0,
  getCartAmount: () => 0,
  searchTerm: "",
  setSearchTerm: () => {},
  filteredProducts: [],
  updateStock: async () => {},
  loading: false,
  setLoading: () => {},
  // setFilteredProducts: () => {},
};

export const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => {
  return useContext(AppContext);
};
export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [currency, setCurrency] = useState<JSX.Element | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { user } = useSession();
  const [loading, setLoading] = useState(true);


const fetchCart = async () => {
    try {
      if (user?.id) {
        const response = await axios.get(`/api/user/nuser?userId=${user.id}`);
        if (response.data?.cartItems) {
          const formattedCartItems: CartItems = {};

          response.data.cartItems.forEach((item: CartItem) => {
            formattedCartItems[item.productId] = item.quantity;
          });
          setCartItems(formattedCartItems);
        } else {
          setCartItems({});
        }
      } else {
        setCartItems({});
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart data.");
      setCartItems({});
    }
  };
 
  
  const fetchProductData = async () => {
    setCurrency(
      <span>
        <TbCurrencyNaira />
      </span>
    );
  
    try {
      const response = await axios.get("/api/public/product");

      if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
        setLoading(false)
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const addToCart = async (itemId: string) => {
    const cartData = structuredClone(cartItems);
    const product = products.find((p) => p.id === itemId);
    const currentQuantityInCart = cartData[itemId] || 0;

    if (product && product.Stock > currentQuantityInCart) {
      cartData[itemId] = currentQuantityInCart + 1;
      setCartItems(cartData);
      toast.success("Cart Added");
      updateStock(itemId, product.Stock - 1);
      try {
        await axios.post("/api/cart/update", {
          productId: itemId,
          quantity: 1,
        });
       
      } catch (error) {
        console.error("Error posting to cart API:", error);
        cartData[itemId] = currentQuantityInCart;
        setCartItems(cartData);
        updateStock(itemId, product.Stock);
      }
    } else if (product) {
      alert(`Product "${product.name}" is out of stock.`);
    }
    // const cartData = structuredClone(cartItems);
    // if (cartData[itemId]) {
    //   cartData[itemId] += 1;
    // } else {
    //   cartData[itemId] = 1;
    // }
    // setCartItems(cartData);
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    const cartData = structuredClone(cartItems);
    const product = products.find((p) => p.id === itemId);
    const currentQuantityInCart = cartData[itemId] || 0;
    const stockDifference = quantity - currentQuantityInCart;

    if (product && quantity <= product.Stock && quantity >= 0) {
      cartData[itemId] = quantity;
      setCartItems(cartData);
      toast.success("Cart updated");
      await updateStock(itemId, product.Stock - stockDifference);
      try {
        if (quantity === 0) {
          await axios.delete(
            `/api/cart/delete?userId=${user?.id}&productId=${itemId}`
          );
          toast.success("Cart item removed");
        } else {
          await axios.post("/api/cart/update", {
            productId: itemId,
            quantity: -1,
          });
          
        }
      } catch (error) {
        console.error("Error posting to cart API:", error);
        cartData[itemId] = currentQuantityInCart;
        setCartItems(cartData);
        updateStock(itemId, product.Stock);
      }
    } else if (product && quantity > product.Stock) {
      alert(`Only ${product.Stock} units of "${product.name}" are in stock.`); // Or a better message
    } else if (quantity < 0) {
      alert("Quantity cannot be negative."); // Or a better message
    }
    // const cartData = structuredClone(cartItems);
    // if (quantity === 0) {
    //   delete cartData[itemId];
    // } else {
    //   cartData[itemId] = quantity;
    // }
    // setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product.id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  const updateStock = async (itemId: string, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === itemId ? { ...product, Stock: newStock } : product
      )
    );
  };

  useEffect(() => {
    fetchProductData();
    if(user){
      fetchCart()
    }
  }, [user]);

  const value = {
    currency,
    router,
    products,
    fetchProductData,
    getCartAmount,
    getCartCount,
    cartItems,
    setCartItems,
    updateCartQuantity,
    addToCart,
    searchTerm,
    setSearchTerm,
    filteredProducts,
    updateStock,
    loading,
    setLoading
    // setFilteredProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
