"use client";
import { ReceiptProps } from "@/lib/commons/types";
import {
  Box,
  HStack,
  Icon,
  Text,
  TextProps,
  VStack,
  Button,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { BiSolidError } from "react-icons/bi";
import { BsFillClockFill, BsFillPatchCheckFill } from "react-icons/bs";
import { IoCheckmarkDoneSharp, IoWarningOutline } from "react-icons/io5";
import { TbClockExclamation } from "react-icons/tb";

interface ReceiptLayoutProps {
  hideLogo?: boolean;
  hideFooter?: boolean;
  footerMessage?: string;
  data?: ReceiptProps;
  isLayout?: boolean;
  onClose: () => void;
}

interface ReceiptEntryProps {
  k: string;
  v: string | undefined;
  fontSize: TextProps["fontSize"];
}

const ReceiptEntry = ({ k, v, fontSize }: ReceiptEntryProps) => {
  return (
    <>
      <HStack w={"full"} gap={4} py={1.5}>
        <Box
          px={2}
          flex={1}
          // border={"0.5px solid"}
          // borderColor={"gray.300"}
        >
          <Text
            className={"public-sans"}
            textTransform={"capitalize"}
            fontSize={fontSize || "10"}
            fontWeight={"600"}
            color={"#697a8d"}
          >
            {k?.replace(/_/g, " ")}
          </Text>
        </Box>
        <Box
          px={2}
          flex={2}
          // border={"0.5px solid"}
          // borderColor={"gray.300"}
        >
          <Text
          className={'public-sans'}
            textTransform={"capitalize"}
            fontSize={fontSize || "10"}
            color={"gray.500"}
            // fontWeight={"semibold"}
          >
            {v}
          </Text>
        </Box>
      </HStack>
    </>
  );
};

const Layout3 = ({ data, isLayout, onClose }: ReceiptLayoutProps) => {
  const config = {
    fontSize: isLayout ? "6" : "9",
  };

  return (
    <>
      <VStack
        minH={isLayout ? "xs" : "md"}
        w={"full"}
        px={0}
        bgColor={"#FFF"}
        gap={4}
        justifyContent={"flex-start"}
      >
        <Box
          // p={isLayout ? 2 : 4}
          w={"full"}
          // bgColor={
          //   data?.status == "success"
          //     ? "twitter.500"
          //     : data?.status == "pending"
          //     ? "orange.500"
          //     : "red.500"
          // }
        ></Box>
        {/* Receipt Header */}
        <VStack>
          {data?.status == "success" ? (
            <Icon
              as={IoCheckmarkDoneSharp}
              color={"whatsapp.500"}
              fontSize={isLayout ? "32" : "64"}
            />
          ) : data?.status == "pending" ? (
            <Icon
              as={TbClockExclamation}
              color={"orange.500"}
              fontSize={isLayout ? "32" : "64"}
            />
          ) : data?.status == "failed" ? (
            <Icon
              as={IoWarningOutline}
              color={"red.500"}
              fontSize={isLayout ? "36" : "72"}
            />
          ) : null}
          <Text
            fontWeight={"bold"}
            className="public-sans"
            color={
              data?.status == "success"
                ? "#71DD37"
                : data?.status == "pending"
                ? "orange.500"
                : data?.status == "failed"
                ? "red.500"
                : "gray.700"
            }
            textTransform={"uppercase"}
            fontSize={isLayout ? "sm" : "xs"}
          >
            {data?.status}
          </Text>
          <Text
            className={"public-sans"}
            fontSize={isLayout ? "40px" : "3xl"}
            // fontWeight={"600"}
            color={"gray.900"}
            // pt={4}
          >
            {Number(data?.amount ?? 0)?.toFixed(0)}
          </Text>
        </VStack>

        {/* Receipt Body */}
        <Box w={"full"} px={isLayout ? 3 : 6}>
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
            v={new Date(data?.timestamp || new Date()).toLocaleString("en-GB").replace(",","")}
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

        <HStack alignItems={"center"} justifyContent={"center"}>
          <Button size={"sm"} colorScheme={"teal"} onClick={onClose} fontSize={'10'} bgColor={'gray.500'}>
            Close
          </Button>
        </HStack>

        {/* <Box
          p={isLayout ? 2 : 4}
          w={"full"}
          bgColor={
            data?.status == "success"
              ? "whatsapp.500"
              : data?.status == "pending"
              ? "orange.500"
              : "red.500"
          }
        ></Box> */}
      </VStack>
    </>
  );
};

export default Layout3;
