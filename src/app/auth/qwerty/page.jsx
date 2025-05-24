"use client";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  VStack,
  Checkbox,
  Link,
  Image,
  Flex,
  Text,
  useToast,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  HStack,
  PinInput,
  Box,
  PinInputField,
} from "@chakra-ui/react";
import Navbar from "@/components/main/Navbar";
import { API } from "@/lib/api";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Login = () => {
  const Toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState([]);

  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("services"));
    if (data) {
      setServices(data);
      setIsOtpRequired(
        data?.find(
          (item) => item?.name == "otp" && item?.provider == "portal"
        )?.status
      );
    }
  }, []);

  async function sendOtp() {
    setIsLoading(true);
    try {
      await API.sendOtp({ email: email });
      Toast({
        status: "success",
        description: "OTP sent to Email",
      });
      setIsLoading(false);
      setIsOtpSent(true);
    } catch (error) {
      setIsLoading(false);
      Toast({
        status: "error",
        title: "Error while sending OTP",
        description: error?.message,
      });
      console.log(error);
    }
  }

  async function login() {
    setIsLoading(true);
    try {
      if (!email || !password) {
        Toast({
          status: "warning",
          description: "Email & password  are required.",
        });
        return;
      }
      const res = await API.login({
        email: email,
        password: password,
        otp: otp,
      });

      if (res?.original?.access_token?.user) {
        const role = res?.original?.access_token?.user?.roles[0]?.name;
        const user = JSON.stringify({
          ...res?.original?.access_token?.user,
          roles: role,
        });
        localStorage.setItem("user", user);
        localStorage.setItem("role", role);
        window.location.href = `/${
          role == "admin" ? "admin" : "member"
        }/dashboard`;
      }
    } catch (error) {
      setIsLoading(false);
      Toast({
        status: "error",
        title: "Error while logging in",
        description: error?.message,
      });
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />
      <Stack minH="100vh" direction={{ base: "column-reverse", md: "row" }}>
        <Flex flex={1}>
          <Image
            alt="Cover image"
            objectFit="cover"
            src="https://bit.ly/2k1H1t6"
          />
        </Flex>
        <Flex
          p={8}
          flex={1}
          align="center"
          justifyContent="center"
          direction={"column"}
        >
          <Stack spacing={4}>
            <Stack align="center">
              <Heading fontSize="2xl">Sign in to your account</Heading>
            </Stack>
            <VStack
              as="form"
              spacing={8}
              boxSize={{ base: "xs", sm: "sm", md: "md" }}
              h="max-content !important"
              bg={useColorModeValue("white", "gray.700")}
              rounded="lg"
              //   boxShadow="lg"
              p={{ base: 5, sm: 10 }}
            >
              <VStack spacing={8} w="100%">
                <FormControl id="email" variant={"floating"}>
                  <Input
                    rounded="md"
                    type="email"
                    placeholder=" "
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormLabel>Email</FormLabel>
                </FormControl>
                <FormControl id="password" variant={"floating"}>
                  <InputGroup>
                    <Input
                      rounded="md"
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormLabel>Password</FormLabel>
                    <InputRightElement
                      children={showPassword ? <BsEye /> : <BsEyeSlash />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputGroup>
                </FormControl>
              </VStack>
              <VStack w="100%">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  w="100%"
                  mb={8}
                >
                  <Checkbox colorScheme="green" size="md">
                    Remember me
                  </Checkbox>
                  <Link
                    fontSize={{ base: "md", sm: "md" }}
                    color={"twitter.600"}
                    href="/auth/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </Stack>
                <br />
                {isOtpSent ? (
                  <Box>
                    <FormLabel>Enter OTP</FormLabel>
                    <HStack>
                      <PinInput onComplete={(value) => setOtp(value)}>
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                      </PinInput>
                    </HStack>
                  </Box>
                ) : null}
                <br />
                {isOtpRequired ? (
                  <Button
                    mt={4}
                    rounded="md"
                    w="100%"
                    onClick={sendOtp}
                    isLoading={isLoading}
                    variant={"outline"}
                  >
                    {isOtpSent ? "Resend OTP" : "Send OTP"}
                  </Button>
                ) : (
                  <Button
                    bg="brand.primary"
                    color="white"
                    _hover={{
                      bg: "brand.hover",
                    }}
                    mt={4}
                    rounded="md"
                    w="100%"
                    onClick={login}
                    isLoading={isLoading}
                  >
                    Sign in
                  </Button>
                )}
                <br />
                {isOtpSent ? (
                  <Button
                    bg="brand.primary"
                    color="white"
                    _hover={{
                      bg: "brand.hover",
                    }}
                    mt={4}
                    rounded="md"
                    w="100%"
                    onClick={login}
                    isLoading={isLoading}
                  >
                    Sign in
                  </Button>
                ) : (
                  false
                )}
                <br />
                {services &&
                services?.find(
                  (item) =>
                    item?.provider == "portal" && item?.name == "allow_signup"
                )?.status ? (
                  <Text as={"a"} href={"/auth/signup"} color={"twitter.700"}>
                    Don't have an account? Register here!
                  </Text>
                ) : null}
              </VStack>
            </VStack>
          </Stack>

          <br />
          <br />
          <br />
          <Text fontSize={"xs"}>
            &copy; Copyright {new Date().getFullYear()} - {process.env.NEXT_PUBLIC_BRAND_NAME}
          </Text>
        </Flex>
      </Stack>
    </>
  );
};

export default Login;
