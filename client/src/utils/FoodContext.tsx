import React, { createContext, useContext, useState } from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";

const backendUrl = "http://localhost:8000/";
// const backendUrl = "https://zomateen-backend.herokuapp.com/";

export const FoodContext = createContext<FoodContextType>({
  loading: false,
  foodies: null,
  favoriteFoodies: null,
  orders: null,
  getOrders: async () => {},
  getFavorites: async () => {},
  getFood: async () => {},
  addToFavorites: async () => {},
  deleteFromFavorites: async () => {},
});

export function useFood(): FoodContextType {
  return useContext(FoodContext);
}

export const FoodContextProvider: React.FC = ({ children }) => {
  const { cookies, currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<OrderType[] | null>(null);
  const [favoriteFoodies, setFavoriteFoodies] = useState<FoodType[] | null>(
    null
  );
  const [foodItems, setFoodItems] = useState<FoodType[] | null>(null);

  function checkToken(token: string) {
    const accessToken = Cookies.get("accessToken");

    if (accessToken === token) {
      Cookies.remove("accessToken");
      Cookies.set("accessToken", token, {
        secure: true,
        path: "/",
        expires: 1,
        sameSite: "Strict",
      });
    }
  }

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
        console.log(res);
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
    const data = { usn: currentUser?.usn, foodId };

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

  const foodies: FoodContextType = {
    loading,
    foodies: foodItems,
    orders,
    favoriteFoodies,
    getFood,
    getFavorites,
    addToFavorites,
    deleteFromFavorites,
    getOrders,
  };

  return (
    <FoodContext.Provider value={foodies}>{children}</FoodContext.Provider>
  );
};
