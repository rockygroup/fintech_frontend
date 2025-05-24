"use client";
import {
  Box,
  Text,
  Icon,
  VStack,
  HStack,
  Avatar,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaReceipt } from "react-icons/fa";
import ReceiptButton from "../misc/ReceiptButton";
import TransactionBadge from "../misc/TransactionBadge";

const RecentTransactions = () => {
  const [data, setData] = useState([
    { id: 1, name: "John Doe", amount: "50" },
    { id: 1, name: "John Doe", amount: "50" },
    { id: 1, name: "John Doe", amount: "50" },
  ]);

  return (
    <>
      <VStack w={"full"} gap={4} maxH={"sm"} overflowY={"scroll"}>
        {data?.map((item, key) => (
          <Box
            key={key}
            pos={"relative"}
            p={4}
            rounded={"8"}
            border={"0.5px solid"}
            borderColor={"gray.200"}
            bgColor={"#FFF"}
            w={"full"}
          >
            <HStack w={"full"} justifyContent={"space-between"}>
              <HStack justifyContent={"flex-start"}>
                <Avatar size={"xs"} />
                <Text fontSize={"sm"}>Sangam Kumar</Text>
              </HStack>
              <HStack
                pos={"absolute"}
                top={4}
                right={0}
                roundedStart={"full"}
                overflow={'hidden'}
              >
                <TransactionBadge>payout</TransactionBadge>
              </HStack>
            </HStack>
            <HStack alignItems={"center"} m={2}>
              <Text fontWeight={"bold"} color={"gray.600"} fontSize={"lg"}>
                ₹{Number(2500)?.toLocaleString("en-IN") ?? 0}
              </Text>
              <Text
                fontSize={"8"}
                fontWeight={"semibold"}
                color={"#FFF"}
                bgColor={"whatsapp.500"}
                rounded={4}
                p={1}
              >
                SUCCESS
              </Text>
            </HStack>
            <Text m={2} fontSize={"xs"} fontWeight={"medium"}>
              Remarks:
            </Text>
            <HStack m={2} mb={0} alignItems={"flex-start"}>
              <Text flex={9} fontSize={"xs"}>
                No remarks to show{" "}
              </Text>
              <Box flex={1}>
                <ReceiptButton />
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </>
  );
};

export default RecentTransactions;
