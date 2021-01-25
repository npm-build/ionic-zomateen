/// <reference types="react-scripts" />

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
  errorContext: string | null;
  cookies: {
    accessToken: string;
    refreshToken: string;
  } | null;
  updateUser: () => Promise<void>;
  login: (userName: string, password: string) => Promise<void>;
  signUp: ({
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
  favoriteFoodies: FoodType[] | null;
  getFood: () => Promise<void>;
  getFavorites: () => Promise<void>;
  addToFavorites: (foodId: number) => Promise<void>;
  deleteFromFavorites: (foodId: number) => Promise<void>;
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
