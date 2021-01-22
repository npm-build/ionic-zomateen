import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import { AuthContextType, UserType } from "../../react-app-env";

const accessToken = Cookies.get("accessToken");

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  loading: false,
  currentUser: null,
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);

  async function getUser() {
    setLoading(true);

    await axios
      .get("/api/user/getUser", {
        headers: {
          Authorization: "Bearer " + accessToken,
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
      .post("/api/user/login", JSON.stringify(data), {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then(async (res) => {
        setLoggedIn(true);
        const at = res.data.accessToken.toString();
        const rt = res.data.refreshToken.toString();

        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.set("accessToken", at, {
          path: "/",
          expires: new Date(new Date().getTime() + 40 * 60 * 1000),
          secure: true,
          sameSite: "Strict",
        });

        Cookies.set("refreshToken", rt, {
          path: "/",
          expires: new Date(new Date().getTime() + 40 * 60 * 1000),
          secure: true,
          sameSite: "Strict",
        });

        await getUser();
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
    await fetch("/api/user/signup", {
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
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
