"use client";
import { Box, VStack } from "@chakra-ui/react";
import Lottie from "lottie-react";
import animation2 from "../../../public/assets/lottie/loading/animation2.json";
import React from "react";


const Loader = ({ text }) => {
  return (
    <>
      <VStack
        w={"full"}
        pos={"fixed"}
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgColor={"blackAlpha.600"}
        justifyContent={"center"}
        zIndex={99999}
        color={'#FFF'}
      >
        <Box boxSize={36} mb={4}>
          <Lottie animationData={animation2} loop={true} />
        </Box>
        <p style={{ textAlign: "center" }}>
          {text || "Loading please wait..."}
        </p>
      </VStack>
    </>
  );
};

export default Loader;
