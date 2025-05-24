"use client";
import { API } from "@/lib/api";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

const SidebarPortalBanks = () => {
  const ref = useRef(true);
  const { handleError } = useErrorHandler();
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const banks = JSON.parse(localStorage.getItem("banks"));
    if (banks?.length) {
      setBanks(banks);
    } else if (ref.current) {
      ref.current = false;
      fetchData();
    }
  }, []);

  async function fetchData() {
    try {
      const res = await API.getPortalBanks();
      setBanks(res.data);
      localStorage.setItem("banks", JSON.stringify(res?.data));
    } catch (error) {
      handleError({
        title: "Could not get portal banks",
        error: error,
      });
    }
  }

  return (
    <>
      <Stack
        direction={["column", "row"]}
        w={"full"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={4}
        flexWrap={"wrap"}
      >
        {banks.map((item: any, key) => (
          <Box
            key={key}
            p={4}
            border={"1px solid"}
            borderColor={"#999"}
            rounded={4}
          >
            <HStack w={"full"} justifyContent={"flex-start"}>
              <Text fontSize={"xs"} fontWeight={"semibold"} flex={2}>
                Bank Name
              </Text>
              <Text fontSize={"xs"} flex={3}>
                {item?.name}
              </Text>
            </HStack>
            <HStack w={"full"} justifyContent={"flex-start"}>
              <Text fontSize={"xs"} fontWeight={"semibold"} flex={2}>
                Account No.
              </Text>
              <Text fontSize={"xs"} flex={3}>
                {item?.account_number}
              </Text>
            </HStack>
            <HStack w={"full"} justifyContent={"flex-start"}>
              <Text fontSize={"xs"} fontWeight={"semibold"} flex={2}>
                Beneficiary
              </Text>
              <Text fontSize={"xs"} flex={3}>
                {item?.beneficiary_name}
              </Text>
            </HStack>
            <HStack w={"full"} justifyContent={"flex-start"}>
              <Text fontSize={"xs"} fontWeight={"semibold"} flex={2}>
                IFSC
              </Text>
              <Text fontSize={"xs"} flex={3}>
                {item?.ifsc_code}
              </Text>
            </HStack>
            <HStack w={"full"} justifyContent={"flex-start"}>
              <Text fontSize={"xs"} fontWeight={"semibold"} flex={2}>
                UPI ID
              </Text>
              <Text fontSize={"xs"} flex={3}>
                {item?.upi_id}
              </Text>
            </HStack>
          </Box>
        ))}
      </Stack>
    </>
  );
};

export default SidebarPortalBanks;
