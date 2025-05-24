"use client";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const MessageRibbon = () => {
  return (
    <>
      <Box p={2} bgColor={"brand.hover"}>
        <Text fontSize={"xs"} textAlign={"center"} color={"#FFF"} fontWeight={'medium'}>
          The portal will undergo maintainance on 8th Feb, 2023 from 12:00 PM to
          4:00 PM IST
        </Text>
      </Box>
    </>
  );
};

export default MessageRibbon;
