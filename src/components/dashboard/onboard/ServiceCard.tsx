"use client";
import CustomButton from "@/components/misc/CustomButton";
import { Box, Image, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface ServiceCardProps {
  name: string;
  description?: string;
  provider: "eko" | "paysprint";
  id?: string | number;
  icon?: ReactNode;
  isActive?: boolean;
}

const ServiceCard = ({
  name,
  description,
  provider,
  isActive,
  id,
  icon,
}: ServiceCardProps) => {
  return (
    <>
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
        {icon || (
          <Image src={`/assets/images/logos/${provider}_logo.svg`} w={16} />
        )}
        <Text
          fontWeight={"medium"}
          textTransform={"capitalize"}
          textAlign={"center"}
        >
          {name}
        </Text>
        <Text fontSize={"xs"} color={"#333"} textAlign={"center"}>
          {description || "No description provided."}
        </Text>
        <CustomButton
          size={"sm"}
          rounded={"full"}
          variant={isActive ? "outline" : "solid"}
        >
          {isActive ? "Active" : "Activate"}
        </CustomButton>
      </Box>
    </>
  );
};

export default ServiceCard;
