/// <reference types="react-scripts" />

interface UserType {
  firstName: string;
  lastName: string;
  userName: string;
  usn: string;
  collegeId?: string;
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

interface OrderType {
  foodIds: number[];
  customerName: string;
  orderId: number;
  messages: string;
  status: string;
  isCompleted: boolean;
  dateOfOrder: Date;
}

interface AuthContextType {
  loggedIn: boolean;
  redirectUrl: string;
  loading: boolean;
  currentUser: UserType | null;
  errorContext: string | null;
  cookies: {
    accessToken: string;
    refreshToken: string;
  } | null;
  updateUser: () => Promise<void>;
  logOut: () => Promise<void>;
  login: (
    userName: string,
    password: string,
    userType: string
  ) => Promise<void>;
  signUp: (
    {
      firstName: string,
      lastName: string,
      userName: string,
      usn: string,
      password: string,
      phone: number,
    },
    userType: string
  ) => Promise<void>;
}

interface FoodContextType {
  loading: boolean;
  foodies: FoodType[] | null;
  cartItems: FoodType[] | null;
  orders: OrderType[] | null;
  favoriteFoodies: FoodType[] | null;
  getFood: () => Promise<void>;
  getOrders: () => Promise<void>;
  getFavorites: () => Promise<void>;
  getCartItems: () => Promise<void>;
  addToFavorites: (foodId: number) => Promise<void>;
  deleteFromFavorites: (foodId: number) => Promise<void>;
  addToCart: (foodId: number) => Promise<void>;
}
