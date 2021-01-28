import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const backendUrl = "http://localhost:8000/";
// const backendUrl = "https://zomateen-backend.herokuapp.com/";

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  redirectUrl: "",
  loading: false,
  currentUser: null,
  cookies: null,
  errorContext: null,
  login: async () => {},
  logOut: async () => {},
  signUp: async () => {},
  updateUser: async () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

const isAdmin = Cookies.get("isAdmin");

export const AuthContextProvider: React.FC = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("/user/home");
  const [errorContext, setErrorContext] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [cookies, setCookies] = useState<{
    accessToken: string;
    refreshToken: string;
  } | null>(null);

  useEffect(() => {
    if (isAdmin === "true") {
      setRedirectUrl("/admin/orders");
    }

    if (
      Cookies.get("accessToken") !== undefined &&
      Cookies.get("refreshToken") !== undefined
    ) {
      const cookie = {
        accessToken: Cookies.get("accessToken") as string,
        refreshToken: Cookies.get("refreshToken") as string,
      };

      if (cookie) {
        setCookies(cookie);
        setLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    if (cookies?.accessToken) updateUser();
  }, [cookies]);

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

  async function updateUser() {
    let apiRoute =
      redirectUrl === "/admin/orders"
        ? "api/admin/getUser"
        : "api/user/getUser";

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
        console.log(res);
        setUser(res.data.user);
        checkToken(res.data.token);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }

  async function login(userName: string, password: string, userType: string) {
    const data = {
      userName,
      password,
    };
    setLoading(true);
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

        Cookies.remove("isAdmin");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        setCookies({ accessToken: at, refreshToken: rt });

        Cookies.set("accessToken", at, {
          secure: true,
          path: "/",
          expires: 1,
          sameSite: "Strict",
        });

        Cookies.set("refreshToken", rt, {
          secure: true,
          path: "/",
          expires: 365,
          sameSite: "Strict",
        });

        userType === "admin"
          ? Cookies.set("isAdmin", "true")
          : Cookies.set("isAdmin", "false");

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
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
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
    let apiUrl = "api/user/signup";
    const realData = [];

    if (userType === "admin") {
      apiUrl = "api/admin/signup";
      realData.push({
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        collegeId: data.usn,
        password: data.password,
        phone: data.phone,
      });
    }

    await axios
      .post(`${backendUrl}${apiUrl}`, realData[0], {
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
        throw new Error(e);
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
    errorContext,
    updateUser,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
