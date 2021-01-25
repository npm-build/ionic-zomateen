import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

// const backendUrl = "http://localhost:8000/";
const backendUrl = "https://zomateen-backend.herokuapp.com/";

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  loading: false,
  currentUser: null,
  cookies: null,
  errorContext: null,
  login: async () => {},
  signUp: async () => {},
  updateUser: async () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [errorContext, setErrorContext] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [cookies, setCookies] = useState<{
    accessToken: string;
    refreshToken: string;
  } | null>(null);

  async function getStuff() {
    await updateUser();
  }

  useEffect(() => {
    if (
      Cookies.get("accessToken") !== undefined &&
      Cookies.get("refreshToken") !== undefined
    ) {
      setLoggedIn(true);

      const cookie = {
        accessToken: Cookies.get("accessToken") as string,
        refreshToken: Cookies.get("refreshToken") as string,
      };

      if (cookie) setCookies(cookie);
    }
  }, []);

  useEffect(() => {
    if (cookies?.accessToken) getStuff();
  }, [cookies]);

  async function updateUser() {
    setLoading(true);

    await axios
      .get(`${backendUrl}api/user/getUser`, {
        headers: {
          Authorization: "Bearer " + cookies!.accessToken,
        },
      })
      .then((res) => {
        setLoading(false);
        setUser(res.data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }

  async function login(userName: string, password: string) {
    const data = {
      userName,
      password,
    };

    setLoading(true);

    await axios
      .post(`${backendUrl}api/user/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (res) => {
        setLoggedIn(true);
        const at = res.data.accessToken.toString();
        const rt = res.data.refreshToken.toString();

        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        setCookies({ accessToken: at, refreshToken: rt });

        Cookies.set("accessToken", at, {
          secure: true,
          path: "/",
          expires: new Date(new Date().getTime() + 40 * 60 * 1000),
          sameSite: "Strict",
        });

        Cookies.set("refreshToken", rt, {
          secure: true,
          path: "/",
          expires: new Date(new Date().getTime() + 40 * 60 * 1000),
          sameSite: "Strict",
        });
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        throw new Error(e);
      });
  }

  async function signUp(data: {
    firstName: string;
    lastName: string;
    userName: string;
    usn: string;
    password: string;
    phone: number;
  }) {
    setLoading(true);

    await fetch(`${backendUrl}api/user/signup`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    })
      .then((res) => {
        setLoading(false);
        return res.json();
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        throw new Error(e);
      });
  }

  const auth: AuthContextType = {
    loggedIn,
    loading,
    currentUser: user,
    login,
    signUp,
    cookies,
    errorContext,
    updateUser,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
