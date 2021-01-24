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
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [cookies, setCookies] = useState<{
    accessToken: string;
    refreshToken: string;
  } | null>(null);

  async function getStuff() {
    await getUser();
  }

  useEffect(() => {
    if (
      Cookies.get("accessToken") !== undefined &&
      Cookies.get("refreshToken") !== undefined
    ) {
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

  async function getUser() {
    setLoading(true);

    await axios
      .get(`${backendUrl}api/user/getUser`, {
        headers: {
          Authorization: "Bearer " + cookies!.accessToken,
        },
      })
      .then((user) => {
        setLoading(false);
        setUser(user.data);
      });
  }

  async function login(userName: string, password: string) {
    const data = {
      userName,
      password,
    };

    setLoading(false);

    await axios
      .post(`${backendUrl}api/user/login`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (res) => {
        console.log(res);
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
      })
      .catch((e) => {
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
        return res.json();
      })
      .catch((e) => {
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
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
