"use client";
import Forbidden from "@/components/cms/Forbidden";
import Loader from "@/components/global/Loader";
import CustomButton from "@/components/misc/CustomButton";
import { API } from "@/lib/api";
import useAuth from "@/lib/hooks/useAuth";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

const page = () => {
  const ref = useRef(true);
  const { user, authUser } = useAuth();
  const { handleError } = useErrorHandler();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (ref.current) {
        ref.current = false;
        await authUser(true);
      }
    })();
  }, []);

  if (!user?.active) {
    return <Forbidden />;
  }

  async function onboard(provider: "eko" | "paysprint") {
    try {
      if (provider == "paysprint") return;
      setIsLoading(true);
      await API.onboardUser(provider);
      await authUser(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError({
        title: "Error while onboarding you",
        error: error,
      });
    }
  }

  return (
    <>
      {isLoading ? <Loader text={"Processing your request..."} /> : null}

      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Eko Services
      </Heading>

      <HStack gap={4} flexWrap={"wrap"}>
        <Box
          p={4}
          bgColor={"#FFF"}
          boxShadow={"lg"}
          rounded={4}
          boxSize={52}
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={4}
        >
          <Image src="/assets/images/logos/eko_logo.svg" w={16} />
          <Text fontSize={"xs"} color={"#333"} textAlign={"center"}>
            {user?.eko_user_code
              ? "You can use Eko services now"
              : "Please start the onboarding process to use services"}
          </Text>
          <CustomButton
            size={"sm"}
            rounded={"full"}
            onClick={() => {
              if (!user?.eko_user_code) onboard("eko");
            }}
            variant={user?.eko_user_code ? "outline" : "solid"}
          >
            {user?.eko_user_code ? "Activated" : "Start Now"}
          </CustomButton>
        </Box>
      </HStack>

      <br />
      <br />
      <br />

      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Paysprint Services
      </Heading>

      <HStack gap={4} flexWrap={"wrap"}>
        <Box
          p={4}
          bgColor={"#FFF"}
          boxShadow={"lg"}
          rounded={4}
          boxSize={52}
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={4}
        >
          <Image src="/assets/images/logos/paysprint_logo.svg" w={16} />
          <Text fontSize={"xs"} color={"#333"} textAlign={"center"}>
            {user?.paysprint_merchant_id
              ? "You can use Paysprint services now"
              : "Please start the onboarding process to use services"}
          </Text>
          <CustomButton
            size={"sm"}
            rounded={"full"}
            onClick={() => {
              if (!user?.paysprint_merchant_id) onboard("paysprint");
            }}
            variant={user?.paysprint_merchant_id ? "outline" : "solid"}
          >
            {user?.paysprint_merchant_id ? "Activated" : "Start Now"}
          </CustomButton>
        </Box>
      </HStack>
    </>
  );
};

export default page;
