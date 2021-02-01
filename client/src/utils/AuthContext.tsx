import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// const backendUrl = "http://localhost:8000/";
const backendUrl = "https://zomateen-backend.herokuapp.com/";

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  redirectUrl: "",
  loading: false,
  currentUser: null,
  cookies: null,
  login: async () => {},
  logOut: async () => {},
  signUp: async () => {},
  updateUser: async () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

const isAdmin = localStorage.getItem("isAdmin");

export function checkToken(token: string) {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken === token) {
    localStorage.removeItem("accessToken");
    localStorage.setItem("accessToken", token);
  }
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string>(() => {
    return isAdmin === "true" ? "/admin/orders" : "/user/home";
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [cookies, setCookies] = useState<{
    accessToken: string;
    refreshToken: string;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    if (isAdmin === "true") {
      setRedirectUrl("/admin/orders");
    }

    if (
      localStorage.getItem("accessToken") !== null &&
      localStorage.getItem("refreshToken") !== null
    ) {
      const cookie = {
        accessToken: localStorage.getItem("accessToken") as string,
        refreshToken: localStorage.getItem("refreshToken") as string,
      };

      if (cookie) {
        setCookies(cookie);
        setLoggedIn(true);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (cookies?.accessToken) updateUser();
  }, [cookies]);

  async function updateUser() {
    const apiRoute =
      redirectUrl === "/admin/orders"
        ? "api/admin/getUser"
        : "api/user/getUser";

    setLoading(true);
    setLoggedIn(true);

    await axios
      .get(`${backendUrl}${apiRoute}`, {
        headers: {
          Authorization: "Bearer " + cookies!.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        setLoading(false);
        setUser(res.data.user);
        checkToken(res.data.token);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }

  async function login(userName: string, password: string, userType: string) {
    setLoading(true);

    const data = {
      userName,
      password,
    };
    const apiUrl = userType === "admin" ? "api/admin/login" : "api/user/login";

    if (userType === "admin") setRedirectUrl("/admin/orders");
    else setRedirectUrl("/user/home");

    await axios
      .post(`${backendUrl}${apiUrl}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (res) => {
        setLoggedIn(true);
        const at = res.data.accessToken.toString();
        const rt = res.data.refreshToken.toString();
        setCookies({ accessToken: at, refreshToken: rt });

        localStorage.removeItem("isAdmin");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        localStorage.setItem("accessToken", at);
        localStorage.setItem("refreshToken", rt);

        userType === "admin"
          ? localStorage.setItem("isAdmin", "true")
          : localStorage.setItem("isAdmin", "false");

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        throw new Error(e);
      });
  }

  async function logOut() {
    const apiRoute =
      redirectUrl === "/admin/orders" ? "api/admin/logout" : "api/user/logout";

    await axios
      .delete(`${backendUrl}${apiRoute}`, {
        headers: {
          Authorization: "Bearer " + cookies!.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then(() => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setLoggedIn(false);
      })
      .catch((e) => console.log(e));
  }

  async function signUp(
    data: {
      firstName: string;
      lastName: string;
      userName: string;
      usn: string;
      password: string;
      phone: number;
    },
    userType: string
  ) {
    setLoading(true);
    let apiUrl = userType === "admin" ? "api/admin/signup" : "api/user/signup";

    const realData =
      userType === "admin"
        ? {
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            collegeId: data.usn,
            password: data.password,
            phone: data.phone,
          }
        : data;

    await axios
      .post(`${backendUrl}${apiUrl}`, realData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }

  const auth: AuthContextType = {
    loggedIn,
    redirectUrl,
    loading,
    logOut,
    currentUser: user,
    login,
    signUp,
    cookies,
    updateUser,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
