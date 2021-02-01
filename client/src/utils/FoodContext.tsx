import React, { createContext, useContext, useState } from "react";
import axios from "axios";

import { useAuth, checkToken } from "./AuthContext";

// const backendUrl = "http://localhost:8000/";
const backendUrl = "https://zomateen-backend.herokuapp.com/";

export const FoodContext = createContext<FoodContextType>({
  loading: false,
  foodies: null,
  favoriteFoodies: null,
  cartItems: null,
  orders: null,
  userOrders: null,
  getFood: async () => {},
  getFavorites: async () => {},
  getCartItems: async () => {},
  getOrders: async () => {},
  getUserOrders: async () => {},
  addOrder: async () => {},
  updateOrder: async () => {},
  addToFavorites: async () => {},
  deleteFromFavorites: async () => {},
  addToCart: async () => {},
  deleteFromCart: async () => {},
});

export function useFood(): FoodContextType {
  return useContext(FoodContext);
}

export const FoodContextProvider: React.FC = ({ children }) => {
  const { cookies, currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<FoodType[] | null>(null);
  const [orders, setOrders] = useState<OrderType[] | null>(null);
  const [userOrders, setUserOrders] = useState<OrderType[] | null>(null);
  const [favoriteFoodies, setFavoriteFoodies] = useState<FoodType[] | null>(
    null
  );
  const [foodItems, setFoodItems] = useState<FoodType[] | null>(null);

  async function getFood() {
    setLoading(true);

    await axios
      .get(`${backendUrl}api/getfoodies`, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        setFoodItems(res.data.foodies);
        checkToken(res.data.token);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  // Favorites

  async function getFavorites() {
    setLoading(true);

    await axios
      .get(`${backendUrl}api/user/getfavorites`, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        setFavoriteFoodies(res.data.favorites);
        checkToken(res.data.token);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  async function addToFavorites(foodId: number) {
    setLoading(true);
    const data = { usn: currentUser?.usn, foodId };

    await axios
      .patch(`${backendUrl}api/user/addtofavorites`, data, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        checkToken(res.data.token);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  async function deleteFromFavorites(foodId: number) {
    setLoading(true);
    const data = { foodId };

    await axios
      .patch(`${backendUrl}api/user/deletefromfavorites`, data, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        checkToken(res.data.token);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  // Orders

  async function getOrders() {
    setLoading(true);

    await axios
      .get(`${backendUrl}api/order/getorders`, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        setOrders(res.data.orders);
        checkToken(res.data.token);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  async function getUserOrders() {
    setLoading(true);

    await axios
      .get(`${backendUrl}api/order/getuserorders`, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        setUserOrders(res.data.orders);
        checkToken(res.data.token);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  async function addOrder(messages: string, paymentMode: string) {
    setLoading(true);

    const foodIds = cartItems?.map((food) => food.foodId);

    const data = {
      foodIds,
      customerName: `${currentUser?.firstName} ${currentUser?.lastName}`,
      messages,
      paymentMode,
    };

    await axios
      .post(`${backendUrl}api/order/add`, data, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        setCartItems(null);
        setOrders(res.data.orders);
        checkToken(res.data.token);
        foodIds?.map(async (id) => {
          deleteFromCart(id);
        });
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  async function updateOrder(
    orderId: number,
    status: string,
    isCompleted: boolean
  ) {
    setLoading(true);

    const data = {
      orderId,
      status,
      isCompleted,
    };

    await axios
      .patch(`${backendUrl}api/order/update`, data, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        checkToken(res.data.token);
        setLoading(false);
        getOrders();
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  // User Cart

  async function addToCart(foodId: number) {
    setLoading(true);

    await axios
      .post(
        `${backendUrl}api/user/cart/add`,
        { foodId },
        {
          headers: {
            Authorization: "Bearer " + cookies?.accessToken,
            refreshToken: cookies!.refreshToken,
          },
        }
      )
      .then(() => {
        getCartItems();
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  async function getCartItems() {
    setLoading(true);
    await axios
      .get(`${backendUrl}api/user/cart`, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        setCartItems(res.data.cartItems);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  async function deleteFromCart(foodId: number) {
    setLoading(true);

    await axios
      .patch(
        `${backendUrl}api/user/cart/delete`,
        { foodId },
        {
          headers: {
            Authorization: "Bearer " + cookies?.accessToken,
            refreshToken: cookies!.refreshToken,
          },
        }
      )
      .then(() => {
        const tempCartItems = cartItems?.filter(
          (item) => item.foodId !== foodId
        );
        setCartItems(tempCartItems!);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  const foodies: FoodContextType = {
    loading,
    foodies: foodItems,
    orders,
    userOrders,
    getFood,
    cartItems,
    getOrders,
    getUserOrders,
    addOrder,
    updateOrder,
    favoriteFoodies,
    getFavorites,
    addToFavorites,
    deleteFromFavorites,
    addToCart,
    getCartItems,
    deleteFromCart,
  };

  return (
    <FoodContext.Provider value={foodies}>{children}</FoodContext.Provider>
  );
};
