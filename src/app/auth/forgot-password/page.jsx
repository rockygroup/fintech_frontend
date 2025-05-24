"use client";
import React, { useState } from "react";
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

const page = () => {
  const { handleError } = useErrorHandler();
  const Toast = useToast();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!email) {
      Toast({
        description: "Email is required",
      });
      return;
    }
    try {
      setIsLoading(true);
      await API.forgotPassword({ email });
      Toast({
        status: "success",
        description: "Password reset link sent!",
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({ title: "Couldn't send reset link", error: error });
    }
  }

  return (
    <>
      <Navbar />
      <br />
      <Container maxW={["full", "5xl"]} p={[4, 8, 16]}>
        <VStack alignItems={"center"} justifyContent={"center"}>
          <Text fontSize={["xl", "3xl"]} fontWeight={"semibold"}>
            Forgot Password?
          </Text>
          <Text fontSize={["sm", "md"]} textAlign={"center"}>
            Enter your email ID and we will send you a password reset link.
          </Text>

          <br />
          <br />

          <FormControl maxW={["full", "xs"]} variant={"floating"}>
            <Input
              type="email"
              name="email"
              placeholder=" "
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormLabel>Registered Email</FormLabel>
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
            Send Link
          </Button>
        </VStack>
      </Container>
    </>
  );
};

export default page;
