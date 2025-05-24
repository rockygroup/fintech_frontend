"use client";
import * as React from "react";
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
} from "@chakra-ui/react";
import Navbar from "@/components/main/Navbar";

const SplitWithImage = () => {
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
              <VStack spacing={4} w="100%">
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input rounded="md" type="email" />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input rounded="md" type="password" />
                </FormControl>
              </VStack>
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
                >
                  Register
                </Button>
              </VStack>
            </VStack>
          </Stack>

          <br />
          <br />
          <br />
          <Text fontSize={"xs"}>
            &copy; Copyright {new Date().getFullYear()} - {process.env.NEXT_PUBLIC_COMPANY_NAME}
            Pvt. Ltd.
          </Text>
        </Flex>
      </Stack>
    </>
  );
};

export default SplitWithImage;
