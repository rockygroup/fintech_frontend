"use client";
import React, { FC } from "react";
import { BoxProps, HStack, PinInput, PinInputField } from "@chakra-ui/react";

interface CustomPinInputProps {
  mask?: boolean;
  onComplete: (value: string) => void;
  justifyContent?: BoxProps["justifyContent"];
}

const CustomPinInput: FC<CustomPinInputProps> = ({
  mask = false,
  onComplete,
  justifyContent
}) => {
  return (
    <>
      <HStack w={"full"} justifyContent={justifyContent ?? "center"} gap={4}>
        <PinInput mask={mask} onComplete={onComplete}>
          <PinInputField bgColor={"gray.50"} />
          <PinInputField bgColor={"gray.50"} />
          <PinInputField bgColor={"gray.50"} />
          <PinInputField bgColor={"gray.50"} />
        </PinInput>
      </HStack>
    </>
  );
};

export default CustomPinInput;
