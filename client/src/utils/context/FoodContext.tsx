import React, { createContext, useContext, useState } from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

export const FoodContext = createContext<FoodContextType>({
  foodies: null,
  getFood: async () => {},
});

export function useFood(): FoodContextType {
  return useContext(FoodContext);
}

export const FoodContextProvider: React.FC = ({ children }) => {
  const { cookies } = useAuth();
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

  const foodies: FoodContextType = {
    foodies: foodItems,
    getFood,
  };

  return (
    <FoodContext.Provider value={foodies}>{children}</FoodContext.Provider>
  );
};
