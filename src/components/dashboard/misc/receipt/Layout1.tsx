"use client";
import { ReceiptProps } from "@/lib/commons/types";
import { Box, HStack, Icon, Text, TextProps, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { BiSolidError } from "react-icons/bi";
import { BsFillClockFill, BsFillPatchCheckFill } from "react-icons/bs";

interface ReceiptLayoutProps {
  hideLogo?: boolean;
  hideFooter?: boolean;
  footerMessage?: string;
  data?: ReceiptProps;
  isLayout?: boolean;
}

interface ReceiptEntryProps {
  k: string;
  v: string | undefined;
  fontSize: TextProps["fontSize"];
}

const ReceiptEntry = ({ k, v, fontSize }: ReceiptEntryProps) => {
  return (
    <>
      <HStack w={"full"} gap={0}>
        <Box
          px={2}
          py={1}
          flex={1}
          border={"0.5px solid"}
          borderColor={"gray.300"}
        >
          <Text
            textTransform={"capitalize"}
            fontSize={fontSize || "10"}
            fontWeight={"medium"}
          >
            {k?.replace(/_/g, " ")}
          </Text>
        </Box>
        <Box
          px={2}
          py={1}
          flex={2}
          border={"0.5px solid"}
          borderColor={"gray.300"}
        >
          <Text textTransform={"capitalize"} fontSize={fontSize || "10"}>
            {v}
          </Text>
        </Box>
      </HStack>
    </>
  );
};

const Layout1 = ({ data, isLayout }: ReceiptLayoutProps) => {
  const config = {
    fontSize: isLayout ? "6" : "10",
  };

  return (
    <>
      <VStack
        minH={isLayout ? "xs" : "lg"}
        w={"full"}
        p={isLayout ? 3 : 6}
        bgColor={"#FFF"}
        gap={4}
        justifyContent={"space-between"}
      >
        {/* Receipt Header */}
        <VStack>
          <Text
            fontSize={isLayout ? "md" : "3xl"}
            fontWeight={"medium"}
            color={"gray.700"}
          >
            ₹{Number(data?.amount ?? 0)?.toFixed(2)}
          </Text>
          {data?.status == "success" ? (
            <Icon
              as={BsFillPatchCheckFill}
              color={"whatsapp.500"}
              fontSize={isLayout ? "32" : "64"}
            />
          ) : data?.status == "pending" ? (
            <Icon
              as={BsFillClockFill}
              color={"orange.500"}
              fontSize={isLayout ? "32" : "64"}
            />
          ) : data?.status == "failed" ? (
            <Icon
              as={BiSolidError}
              color={"red.500"}
              fontSize={isLayout ? "36" : "72"}
            />
          ) : null}

          <Text
            fontWeight={"semibold"}
            color={
              data?.status == "success"
                ? "whatsapp.500"
                : data?.status == "pending"
                ? "orange.500"
                : data?.status == "failed"
                ? "red.500"
                : "gray.700"
            }
            textTransform={"uppercase"}
            fontSize={isLayout ? "sm" : "md"}
          >
            {data?.status}
          </Text>
        </VStack>

        {/* Receipt Body */}
        <Box w={"full"}>
          <ReceiptEntry
            k="Trnxn Type"
            v={data?.type}
            fontSize={config?.fontSize}
          />
          <ReceiptEntry
            k="Trnxn ID"
            v={data?.transaction_id}
            fontSize={config?.fontSize}
          />

          <ReceiptEntry
            k="Timestamp"
            v={new Date(data?.timestamp || new Date()).toLocaleString("en-GB")}
            fontSize={config?.fontSize}
          />
          {Object.entries(data?.miscData || {})?.map((entry, i) => (
            <ReceiptEntry
              k={entry[0]}
              v={entry[1]}
              fontSize={config?.fontSize}
            />
          ))}
        </Box>

        {/* Receipt Footer */}
        {data?.hideFooter ? null : (
          <VStack gap={1}>
            {data?.hideLogo ? null : (
              <HStack w={"full"} justifyContent={"center"}>
                <Text
                  fontSize={isLayout ? "2xs" : "md"}
                  fontWeight={"semibold"}
                >
                  {process.env.NEXT_PUBLIC_BRAND_NAME}
                </Text>
              </HStack>
            )}
            <Text fontSize={isLayout ? 6 : 10} textAlign={"center"}>
              {data?.footerMessage ||
                "This is a computer generated receipt and does not require physical signature."}
            </Text>
          </VStack>
        )}
      </VStack>
    </>
  );
};

export default Layout1;
