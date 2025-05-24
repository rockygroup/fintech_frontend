"use client";
import React, { ReactNode, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

const layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    validateSession();
  }, []);

  async function validateSession() {
    try {
      const res = await fetch("/api/validate-session", {
        method: 'GET',
        credentials: "include",
      });

      if (!res.ok) {
        console.log("res");
      } else {
        window.location.href = `/${localStorage.getItem("role") == "admin" ? "admin" : "member"}/dashboard`;
      }
    } catch (error) {
      console.log("Error occured while validating your session");
      console.log(error);
    }
  }

  return <>{children}</>;
};

export default layout;
