/// <reference types="react-scripts" />

import firebase from "firebase";

interface UserType {
  firstName: string;
  lastName: string;
  userName: string;
  usn: string;
  password: string;
  phone: number;
  noOfCancels: number;
  favorites: number[];
}

interface FoodType {
  name: string;
  foodId: number;
  tags: string[];
  filePath: string;
  price: number;
  isAvailable: string;
  day: string;
  reviews: { userName: string; review: string }[];
  addOns: string[];
}

interface AuthContextType {
  loggedIn: boolean;
  loading: boolean;
  currentUser: UserType | null;
  login?: (string, string) => Promise<void>;
  signUp?: ({
    firstName: string,
    lastName: string,
    userName: string,
    usn: string,
    password: string,
    phone: number,
  }) => Promise<void>;
}

interface FoodContextType {
  foodies: FoodType[] | null;
  getFood: () => Promise<void>;
  // addFood?: (string, string) => Promise<void>;
  // signUp?: ({
  //   firstName: string,
  //   lastName: string,
  //   userName: string,
  //   usn: string,
  //   password: string,
  //   phone: number,
  // }) => Promise<void>;
}
