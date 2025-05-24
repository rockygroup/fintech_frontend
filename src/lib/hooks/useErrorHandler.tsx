"use client";
import { useToast } from "@chakra-ui/react";
import useAuth from "./useAuth";

interface HandleErrorParams {
  title: string;
  description?: string;
  error?: any;
}

const useErrorHandler = () => {
  const Toast = useToast();
  const { handleLogout, authUser } = useAuth();

  const handleError = ({ title, description, error }: HandleErrorParams) => {
    if (error?.status == 401) {
      handleLogout();
    }
    if (error?.status == 403) {
      authUser();
    }
    console.log(error)
    console.log("Error Status ", error?.status)
    Toast({
      title: title,
      description:
        description || error[1]?.message || error?.message || "Error while processing request",
    });
  };

  return {
    handleError,
  };
};

export default useErrorHandler;
