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
  Image,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import Navbar from "@/components/main/Navbar";
import { API } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import Forbidden from "@/components/cms/Forbidden";

const Signup = () => {
  const Toast = useToast();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("services")
    );
    if (data) {
      setServices(data);
    }
  }, []);

  if (
    !services?.find(
      (item: any) => item?.provider == "portal" && item?.name == "allow_signup"
    )?.status
  ) {
    return <Forbidden />;
  }

  function validateForm(values: any) {
    if (!values?.email) {
      Toast({
        status: "warning",
        description: "Email is required!",
      });
      return;
    }
    // if (
    //   !values?.password ||
    //   !values.password_confirmation ||
    //   values.password != values.password_confirmation
    // ) {
    //   Toast({
    //     status: "warning",
    //     description: "Passwords must be same!",
    //   });
    //   return;
    // }
    register(values);
  }

  async function register(values: any) {
    try {
      setLoading(true);
      const res = await API.signup(values);

      Toast({
        status: "success",
        title: "Registration Succesful!",
        description: "Please login to continue",
      });
      setLoading(false);
      setTimeout(() => {
        push(`/auth/xckvnalo?email=${values?.email}`);
      }, 500);
    } catch (error) {
      setLoading(false);
      Toast({
        status: "error",
        title: "Error while registeration",
        description: error?.message,
      });
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />

      <Stack
        minH="100vh"
        direction={{ base: "column-reverse", md: "row-reverse" }}
      >
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
              <Heading fontSize="2xl">Register new account</Heading>
            </Stack>
            <VStack
              as="form"
              spacing={8}
              boxSize={{ base: "xs", sm: "sm", md: "md" }}
              h="max-content !important"
              bg={useColorModeValue("white", "gray.700")}
              rounded="lg"
              // boxShadow="lg"
              p={{ base: 5, sm: 10 }}
            >
              <Formik
                initialValues={{
                  first_name: "",
                  last_name: "",
                  email: "",
                  // password: "",
                  // password_confirmation: "",
                }}
                onSubmit={(values) => validateForm(values)}
              >
                {({ values, handleChange, handleSubmit, errors }) => (
                  <VStack spacing={8} w="100%">
                    <FormControl variant={"floating"} isRequired>
                      <Input
                        rounded="md"
                        placeholder=" "
                        name="first_name"
                        value={values.first_name}
                        onChange={handleChange}
                      />
                      <FormLabel>First Name</FormLabel>
                    </FormControl>
                    <FormControl variant={"floating"} isRequired>
                      <Input
                        rounded="md"
                        placeholder=" "
                        name="last_name"
                        value={values.last_name}
                        onChange={handleChange}
                      />
                      <FormLabel>Last Name</FormLabel>
                    </FormControl>
                    <FormControl id="email" variant={"floating"} isRequired>
                      <Input
                        rounded="md"
                        type="email"
                        placeholder=" "
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                      />
                      <FormLabel>Email</FormLabel>
                    </FormControl>
                    {/* <FormControl id="password" variant={"floating"} isRequired>
                      <Input
                        rounded="md"
                        type="password"
                        placeholder=" "
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                      />
                      <FormLabel>Password</FormLabel>
                    </FormControl>
                    <FormControl
                      id="password_confirmation"
                      variant={"floating"}
                      isRequired
                    >
                      <Input
                        rounded="md"
                        placeholder=" "
                        name="password_confirmation"
                        value={values.password_confirmation}
                        onChange={handleChange}
                      />
                      <FormLabel>Confirm Password</FormLabel>
                    </FormControl> */}
                    <VStack w="100%">
                      <Button
                        bg="brand.primary"
                        color="white"
                        _hover={{
                          bg: "brand.hover",
                        }}
                        mt={4}
                        rounded="md"
                        w="100%"
                        isLoading={loading}
                        onClick={handleSubmit} // Use handleSubmit from Formik here
                      >
                        Register
                      </Button>
                      <br />
                      <Text as={"a"} href={"/auth/xckvnalo"} color={"twitter.700"}>
                        Already have an account? Login here!
                      </Text>
                    </VStack>
                  </VStack>
                )}
              </Formik>
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

export default Signup;
