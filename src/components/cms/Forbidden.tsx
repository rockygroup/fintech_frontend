"use client";
import { Heading, Icon, VStack } from "@chakra-ui/react";
import React from "react";
import { FaUserSlash } from "react-icons/fa";

const Forbidden = () => {
  return (
    <>
      <VStack
        w={"full"}
        h={'80vh'}
        alignItems={"center"}
        justifyContent={"center"}
        p={[4, 8]}
      >
        <Icon as={FaUserSlash} fontSize={'xxx-large'} color={"gray.500"} />
        <Heading as={"h5"} fontSize={'xl'} color={'gray.500'} textAlign={"center"}>
          You are not allowed to access this page. Please contact admin.
        </Heading>
      </VStack>
    </>
  );
};

export default Forbidden;
