/// <reference types="react-scripts" />

interface UserType {
  firstName: string;
  lastName: string;
  userName: string;
  usn: string;
  collegeId?: string;
  password: string;
  phone: string;
  noOfCancels: number;
  favorites: number[];
  filePath: string;
  reviews: { foodId: number; review: string }[];
  isAdmin: boolean;
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

interface UserDetails {
  firstName: string;
  lastName: string;
  userName: string;
  phone: string;
}

interface ReviewType {
  foodId: number;
  review: string;
  usn: string;
}

interface AuthContextType {
  loggedIn: boolean;
  redirectUrl: string;
  loading: boolean;
  currentUser: UserType | null;
  cookies: {
    accessToken: string;
    refreshToken: string;
  } | null;
  updateUser: () => Promise<void>;
  updateUserDetails: (data: UserDetails) => Promise<void>;
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
  reviews: ReviewType[] | null;
  foodies: FoodType[] | null;
  cartItems: FoodType[] | null;
  orders: OrderType[] | null;
  userOrders: OrderType[] | null;
  favoriteFoodies: FoodType[] | null;
  getFood: () => Promise<void>;
  getOrders: () => Promise<void>;
  getUserOrders: () => Promise<void>;
  addOrder: (messages: string, paymentMode: string) => Promise<void>;
  updateOrder: (
    orderId: number,
    status: string,
    isCompleted: boolean
  ) => Promise<void>;
  getFavorites: () => Promise<void>;
  getCartItems: () => Promise<void>;
  addToFavorites: (foodId: number) => Promise<void>;
  deleteFromFavorites: (foodId: number) => Promise<void>;
  addToCart: (foodId: number) => Promise<void>;
  deleteFromCart: (foodId: number) => Promise<void>;
  getReviews: () => Promise<void>;
  addReview: (foodId: number, review: string) => Promise<void>;
}
