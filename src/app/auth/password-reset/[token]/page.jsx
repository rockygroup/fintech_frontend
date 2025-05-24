"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/main/Navbar";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { API } from "@/lib/api";
import { useSearchParams } from "next/navigation";

const page = ({ params }) => {
  const { token } = params;
  const { handleError } = useErrorHandler();
  const Toast = useToast();
  const query = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(query.get("email"));
  }, []);

  async function handleSubmit() {
    if (!email) {
      Toast({
        description: "Email is required",
      });
      return;
    }
    if (password != passwordConfirmation) {
      Toast({
        description: "Passwords must match",
      });
      return;
    }
    try {
      setIsLoading(true);
      await API.resetPassword({
        email: email,
        token: token,
        password: password,
        password_confirmation: passwordConfirmation,
      });
      Toast({
        status: "success",
        description: "Password reset successfully!",
      });
      setIsLoading(false);
      window.location.replace("/auth/xckvnalo");
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Couldn't reset password", error: error });
    }
  }

  return (
    <>
      <Navbar />
      <br />
      <Container maxW={["full", "5xl"]} p={[4, 8, 16]}>
        <VStack alignItems={"center"} justifyContent={"center"}>
          <Text fontSize={["xl", "3xl"]} fontWeight={"semibold"}>
            Reset Password
          </Text>
          <Text fontSize={["sm", "md"]} textAlign={"center"}>
            Enter your new password for logging in
          </Text>

          <br />
          <br />

          <FormControl maxW={["full", "xs"]} variant={"floating"}>
            <Input
              type="email"
              name="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormLabel>Registered Email</FormLabel>
          </FormControl>
          <br />
          <FormControl maxW={["full", "xs"]} variant={"floating"}>
            <Input
              type="password"
              name="password"
              placeholder=" "
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormLabel>New Password</FormLabel>
          </FormControl>
          <br />
          <FormControl maxW={["full", "xs"]} variant={"floating"}>
            <Input
              name="password_confirmation"
              placeholder=" "
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <FormLabel>Confirm Password</FormLabel>
          </FormControl>
          <br />
          <Button
            w={["full", "xs"]}
            color={"#FFF"}
            bgColor={"brand.primary"}
            _hover={{
              bgColor: "brand.hover",
            }}
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </VStack>
      </Container>
    </>
  );
};

export default page;
