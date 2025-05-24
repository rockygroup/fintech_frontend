"use client";
import { Box, Image } from "@chakra-ui/react";
import React from "react";
import Lottie from "lottie-react";
import animation1 from "../../public/assets/lottie/loading/animation1.json";
import animation2 from "../../public/assets/lottie/loading/animation2.json";
import animation3 from "../../public/assets/lottie/loading/animation3.json";

const loading = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box boxSize={36} mb={4}>
          <Lottie animationData={animation2} loop={true} />
        </Box>
        <p style={{ textAlign: "center" }}>Loading please wait...</p>
      </div>
    </>
  );
};

export default loading;
