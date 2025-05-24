"use client";
import React, { FC, useEffect, useState } from "react";
import { API } from "../api";
import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/react";

interface HandleErrorParams {
  title: string;
  description?: string;
  error?: any;
}

const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const me = JSON.parse(localStorage.getItem("user"));
    if (me) {
      setUser(me);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await API.logout();
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.clear();
      setUser(null);
      Cookies.remove("token");
      setTimeout(() => {
        window.location.replace("/auth/zxcvbnm");
      }, 2000);
    }
  };

  const authUser = async (disableRedirect?: boolean) => {
    try {
      const res = await API.me();
      if (res?.user) {
        const existingRole = localStorage.getItem("role");
        const role = res?.user?.roles[0]?.name;
        const userData = JSON.stringify({
          ...res?.user,
          roles: role,
        });
        localStorage.setItem("user", userData);
        setUser(JSON.parse(userData));

        if (existingRole != role) {
          localStorage.setItem("role", role);
        }
        // if (!disableRedirect) {
        //   window.location.href = `/${
        //     role == "admin" ? "admin" : "member"
        //   }/dashboard`;
        // }
      }
    } catch (error: any) {
      console.log(error);
      if (error?.status == 401) {
        handleLogout();
      }
    }
  };

  return {
    user,
    handleLogout,
    authUser,
  };
};

export default useAuth;
