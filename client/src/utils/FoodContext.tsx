import React, { createContext, useContext, useState } from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";

// const backendUrl = "http://localhost:8000/";
const backendUrl = "https://zomateen-backend.herokuapp.com/";

export const FoodContext = createContext<FoodContextType>({
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
      })
      .catch((e) => console.log(e));
  }

  // Favorites

  async function getFavorites() {
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
      })
      .catch((e) => console.log(e));
  }

  async function addToFavorites(foodId: number) {
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
      })
      .catch((e) => console.log(e));
  }

  async function deleteFromFavorites(foodId: number) {
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
      })
      .catch((e) => console.log(e));
  }

  // Orders

  async function getOrders() {
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
      })
      .catch((e) => console.log(e));
  }

  const foodies: FoodContextType = {
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
