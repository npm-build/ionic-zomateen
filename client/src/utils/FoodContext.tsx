import React, { createContext, useContext, useState } from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";

// const backendUrl = "http://localhost:8000/";
const backendUrl = "https://zomateen-backend.herokuapp.com/";

export const FoodContext = createContext<FoodContextType>({
  foodies: null,
  favoriteFoodies: null,
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
  const [favoriteFoodies, setFavoriteFoodies] = useState<FoodType[] | null>(
    null
  );
  const [foodItems, setFoodItems] = useState<FoodType[] | null>(null);

  async function getFood() {
    await axios
      .get(`${backendUrl}api/getfoodies`, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
        },
      })
      .then((foodies) => setFoodItems(foodies.data))
      .catch((e) => console.log(e));
  }

  async function getFavorites() {
    await axios
      .get(`${backendUrl}api/user/getfavorites`, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
        },
      })
      .then((res) => {
        setFavoriteFoodies(res.data.favorites);
      })
      .catch((e) => console.log(e));
  }

  async function addToFavorites(foodId: number) {
    const data = { usn: currentUser?.usn, foodId };

    await axios
      .patch(`${backendUrl}api/user/addtofavorites`, data, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
        },
      })
      .catch((e) => console.log(e));
  }

  async function deleteFromFavorites(foodId: number) {
    const data = { usn: currentUser?.usn, foodId };

    await axios
      .patch(`${backendUrl}api/user/deletefromfavorites`, data, {
        headers: {
          Authorization: "Bearer " + cookies?.accessToken,
        },
      })
      .catch((e) => console.log(e));
  }

  const foodies: FoodContextType = {
    foodies: foodItems,
    favoriteFoodies,
    getFood,
    getFavorites,
    addToFavorites,
    deleteFromFavorites,
  };

  return (
    <FoodContext.Provider value={foodies}>{children}</FoodContext.Provider>
  );
};
