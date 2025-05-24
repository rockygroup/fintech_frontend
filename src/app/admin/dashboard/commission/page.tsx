"use client";
import CommissionSetup from "@/components/dashboard/commission/CommissionSetup";
import Packages from "@/components/dashboard/commission/Packages";
import CustomButton from "@/components/misc/CustomButton";
import { Box, Button, HStack, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface PackageProps {
  id: string | number;
  name: string;
}

const page = () => {
  const [targetPackage, setTargetPackage] = useState<string | number>("");
  const [packageInfo, setPackageInfo] = useState<PackageProps>();

  return (
    <>
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Packages
      </Heading>

      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        <Packages onEditButtonClick={(id) => setTargetPackage(id)} />
      </Box>
      <br />
      <Heading as={"h1"} fontSize={"xl"} mb={8}>
        Commission Setup {packageInfo ? `- ${packageInfo?.name}` : ""}
      </Heading>
      <Box mb={8} p={6} bgColor={"#FFF"} boxShadow={"base"} rounded={4}>
        {targetPackage ? (
          <CommissionSetup packageId={targetPackage} />
        ) : (
          <Text fontSize={"sm"}>Please select a package</Text>
        )}
      </Box>
    </>
  );
};

export default page;
