import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const accessToken = Cookies.get("accessToken");
const backendUrl = "https://zomateen-backend.herokuapp.com/";

export const FoodContext = createContext<FoodContextType>({
  foodies: null,
  getFood: async () => {},
});

export function useFood(): FoodContextType {
  return useContext(FoodContext);
}

export const FoodContextProvider: React.FC = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodType[] | null>(null);

  async function getFood() {
    await axios
      .get(`${backendUrl}api/getfoodies`, {
        headers: {
          Authorization: "Bearer " + accessToken,
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
